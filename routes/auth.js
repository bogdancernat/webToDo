var db = require('../db')
  , cr = require('crypto')
  , md5
  ;
function getHash (user, callback){
  md5 = cr.createHash('md5');
  user['password'] = md5.update(user['password']).digest('hex');
  callback(user);
}

exports.loginPage = function(req, res){
  res.render('login', {title: 'Login', msg: 'salut'});
}

exports.logout = function(req, res){
  res.clearCookie('et_logged_in');
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
      console.log(resp);
      getHash(user, function(user){
        if (resp.value['password'] == user['password'])
          res.cookie("et_logged_in",{
            "user": user.email,
            "_id": req.sessionID
          },{
            expires: new Date(Date.now()+99999999),
            signed: true
          });
      });
      res.redirect('/');  
    }
    else {
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
  if(allHaveValues){
    db.uniqueUser(user['email'],function (itIs){
      if((itIs && user['password'] == user['repassword']) && (user['password'].length >= 6 && user['password'].length <= 32)){
        delete user['repassword'];
        var matches = user['email'].match("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?");
        if (matches != null && matches.length == 1) {
          getHash(user, function(user) {
            db.insert(user);
            res.cookie("et_logged_in",{
            "user": user['email'],
            "_id": req.sessionID
            },{
              expires: new Date(Date.now()+99999999),
              signed: true
            });
            res.redirect('/');
          });
        } else {
          res.redirect('/');
        }
      } else {
        res.redirect('/');
      }
    });
  } else {
    res.redirect('/');
  }
}