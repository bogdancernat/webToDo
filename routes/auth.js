var db = require('../db')
  , cr = require('crypto')
  , md5
  ;
function getHash (str){
  md5 = cr.createHash('md5');
  return md5.update(str).digest('hex');
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
      if(resp.value['password'] == getHash(user['password'])){
        res.cookie("et_logged_in",{
          "user": user.email,
          "_id": resp.value._id
        },{
          expires: new Date(Date.now()+99999999),
          signed: true
        });
      }
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
      if(itIs && user['password'] == user['repassword']){
        delete user['repassword'];
        user['password'] = getHash(user['password']);
        db.insert(user);
        res.redirect('/');
      }else{
        res.redirect('/');
      }
    });
  } else {
    res.redirect('/');
  }
}