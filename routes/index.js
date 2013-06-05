
/*
 * GET home page.
 */

exports.index = function(req, res){
  console.log(req.signedCookies['todo_logged_in']);
  var info;

  if(typeof req.signedCookies['todo_logged_in'] != 'undefined'){
    info = req.signedCookies['todo_logged_in'];
  } else if (typeof req.signedCookies['todo_memory'] === 'undefined') {console.log(req);
        res.cookie("todo_memory", {
                            "_id": req.sessionID
                        }, {
                            expires: new Date(Date.now()+99999999),
                            signed: true
                        });
  }
  res.render('index', { title: 'WebToDo++ - Manage your time effectively!',
                        user: info
                      });
};