var db = require('../db')
  , cr = require('crypto')
  , md5
  , passport = require('passport')
  , TwitterStrategy = require('passport-twitter').Strategy
  , GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
  ;



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
            var user = {
                'type': 'user',
                'email': profile.username
            }


            db.uniqueUser(user['email'], function (itIs) {
                if (itIs) {
                    db.insert(user, function() {
                        db.getUser(user['email'], function (resp){
                            if(resp){
                                done(null, resp);
                            } 
                        });   
                    });
                } else {
                    db.getUser(user['email'], function (resp){
                        if(resp){
                            done(null, resp);
                        } 
                    });    
                }

            });
        });
  }
));



passport.use(new GoogleStrategy({
        clientID: '291727398085-2u4d917nj3cvdc1ltmonnkib8mrqp0j1.apps.googleusercontent.com',
        clientSecret: 'ijuWf0OW6q_hIoedHAPSsphU',
        callbackURL: 'http://localhost:3000/loginGoogle'
    },

    function (accessToken, refreshToken, profile, done) {
        process.nextTick(function () {
            var user = {
                'type': 'user',
                'from': 'googleAccount',
                'email': profile.emails[0].value
            }

            db.uniqueUser(user['email'], function (itIs) {
                if (itIs) {
                    db.insert(user , function() {
                        db.getUser(user['email'], function (resp){
                            if(resp){
                                done(null, resp);
                            } 
                        });   
                    });
                } else {
                    db.getUser(user['email'], function (resp){
                        if(resp){
                            done(null, resp);
                        } 
                    });    
                }

            });
        });
    }
));



function getHash (user, callback){
    md5 = cr.createHash('md5');
    user['password'] = md5.update(user['password']).digest('hex');
    callback(user);
}



exports.getHash = getHash;



exports.passport = passport;



exports.logout = function(req, res){
    res.clearCookie('todo_logged_in');
    res.redirect('/');
}



exports.loginWithGoogle = function (req, res, next) {
    passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'] }, 
        function(err, user, info) {
            if (user) {
                res.cookie("todo_logged_in",{
                    "user": user.key,
                    "_id": user.id
                }, {
                    expires: new Date(Date.now()+99999999),
                    signed: true
                });
            }

            res.redirect('/'); 
        })(req, res, next);
}




exports.loginWithTwitter = function (req, res, next) {
    passport.authenticate('twitter', function (err, user, info) {
        if (user) {
            res.cookie("todo_logged_in",{
                "user": user.key,
                "_id": user.id
            }, {
                expires: new Date(Date.now()+99999999),
                signed: true
            });
        }

        res.redirect('/'); 
    })(req, res, next);
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



exports.register = function(req,res){
    var user = {
        'type': 'user',
        'from': 'email',
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