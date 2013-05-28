
/*
 * GET home page.
 */

exports.index = function(req, res){
  console.log(req.signedCookies['et_logged_in']);
  var info;
  if(typeof req.signedCookies['et_logged_in'] != undefined){
    info = req.signedCookies['et_logged_in'];
  }
  res.render('index', { title: 'WebToDo++ - Manage your time effectively!',
                        user: info
                      });
};