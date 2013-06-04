var db = require('../db')
  , cr = require('crypto')
  , md5
  , passport = require('passport')
  , TwitterStrategy = require('passport-twitter').Strategy
  , GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
  ;

exports.passport = passport;



passport.serializeUser(function (user, done) {
    done(null, user);
});



passport.deserializeUser(function (obj, done) {
    done(null, obj);
});


passport.use (new TwitterStrategy({
        consumerKey: 's6wF0QuG4mRhwaZCWswA',
        consumerSecret: 'TfLKblLHtYe6sAr5iOy2deSdbSdwQVYTjuGoBsgu9A',
        callbackURL: "http://localhost:3000/loginTwitter/"
    },

    function (token, tokenSecret, profile, done) {
    process.nextTick(function () {

        // To keep the example simple, the user's Twitter profile is returned to
        // represent the logged-in user.  In a typical application, you would want
        // to associate the Twitter account with a user record in your database,
        // and return that user instead.
        return done(null, profile);
    });
  }
));



passport.use(new GoogleStrategy({
        clientID: '291727398085-2u4d917nj3cvdc1ltmonnkib8mrqp0j1.apps.googleusercontent.com',
        clientSecret: 'ijuWf0OW6q_hIoedHAPSsphU',
        callbackURL: 'http://localhost:3000/loginGoogle'
    },

    function (accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
        // To keep the example simple, the user's Google profile is returned to
        // represent the logged-in user.  In a typical application, you would want
        // to associate the Google account with a user record in your database,
        // and return that user instead.
        console.log(profile);
        return done(null, profile);
    });
  }
));



function getHash (user, callback){
    md5 = cr.createHash('md5');
    user['password'] = md5.update(user['password']).digest('hex');
    callback(user);
}



exports.loginPage = function(req, res){
    res.render('login', {title: 'Login', msg: 'salut'});
}



exports.logout = function(req, res){
    res.clearCookie('todo_logged_in');
    res.redirect('/');
}



exports.login = function(req, res){
    var user = {
        'email': req.body.email,
        'password': req.body.password
    }

    for(var key in user){
        user[key] = user[key].replace(/\s/g,''); //remove whitespaces
    }

    db.getUser(user['email'], function (resp){
        if(resp){
            getHash(user, function(user){
                if (resp.value['password'] == user['password'])
                    res.cookie("todo_logged_in",{
                        "user": resp.key,
                        "_id": resp.id
                    }, {
                        expires: new Date(Date.now()+99999999),
                        signed: true
                    });
            });

            res.redirect('/');  
        } else {
          res.redirect('/');
        }
    });
}

exports.registerPage = function(req, res){
    res.render('login', {title: 'Login', msg: 'salut'});
}

exports.register = function(req,res){
    var user = {
        'type': 'user',
        'email': req.body['email'],
        'password': req.body['password'],
        'repassword': req.body['password2']
    }

    var allHaveValues = true;
    for(var key in user){
        if(user[key].length == 0){
            allHaveValues = false;
            break;
        }

        user[key] = user[key].replace(/\s/g,''); //remove whitespaces
    }

    user["email"] = user["email"].toLowerCase();

    if (!allHaveValues) {
        res.redirect('/');
        return;
    }


    db.uniqueUser(user['email'], function (itIs) {
        if(!(itIs && user['password'] == user['repassword']) || !(user['password'].length >= 6 && user['password'].length <= 32)) {
            res.redirect('/');
            return;
        }

        delete user['repassword'];

        var matches = user['email'].match("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?");

        if (matches == null || matches.length != 1) {
            res.redirect('/');
            return;
        }

        getHash(user, function(user) {
            db.insert(user , function() {
                db.getUser(user['email'], function (resp){
                    if(resp){
                        res.cookie("todo_logged_in",{
                            "user": resp.key,
                            "_id": resp.id
                        }, {
                            expires: new Date(Date.now()+99999999),
                            signed: true
                        });

                        res.redirect('/');  
                    } else {
                        res.redirect('/');
                    }
                });
            });
        });
    });
}