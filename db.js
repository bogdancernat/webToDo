var couchDbServer = require('nano')('http://admin:admin0@localhost:5984')
    , dbName = 'web_to_do_db'
    , activeDb
    , design_doc
    ;



couchDbServer.db.get(dbName, function (err){
    if (err){
        console.log('Got some error: ' + err);
        console.log('Creating database...');

        couchDbServer.db.create(dbName, function (err){
            if (err){
                console.log('Oups! There was a problem creating the database: '+ db_name +'.')
                throw err;
            } else {
                console.log('Database ' + dbName + ' created!');
                activeDb = couchDbServer.use(dbName);
                pushViews();
            }
        });
    } else {
        console.log('Selecting database '+ dbName +'!');
        activeDb = couchDbServer.use(dbName);
        console.log('Database ' + dbName + ' selected!');
        pushViews();
    }
});



function pushViews(){
    design_doc = {
        'views':{
            'get_users':{
                'map': function (doc) {
                    if (doc.type=='user'){
                        emit(doc.email, doc);
                    }
                }
            },
            'get_todos':{
                'map': function (doc) {
                    if (doc.type=='todo_item'){
                        emit(doc.user._id, doc);
                    }
                }
            },
            'get_users_twitter':{
                'map': function (doc) {
                    if (doc.type=='twitterUser')
                        emit(doc.username, doc);              
                }
            }
        }
    };

    activeDb.get('_design/web_to_do_views',null, function (err, body){
        if (!err){
            activeDb.destroy('_design/web_to_do_views',body._rev,function (err2, body2){
                activeDb.insert(design_doc,'_design/web_to_do_views',function (err3, res){
                    console.log("Created views.")
                });
            });
        } else {
            activeDb.insert(design_doc,'_design/web_to_do_views',function (err3, res){
                console.log("Created views.")
            });
        }
    });
        // activeDb.view('web_to_do_views','get_users',{key:'cernat.bogdan.stefan@gmail.com'},function (err, body){
        //   console.log(body);
        // });
}



exports.insert = function (obj, callback){
    activeDb.insert(obj,function (err, body, header){
        console.log('inserted');
        console.log(obj);

        if (err){
            throw (err);
        }

        callback();
    });
}



exports.getUser = function (email, callback){
    activeDb.view('web_to_do_views','get_users',{key: email}, function (err,body){
        if (!err){console.log(body);
            callback(body.rows[0]);
        }
    });
}

exports.getTwitterUser = function (username, callback){
    activeDb.view('web_to_do_views','get_users_twitter',{key: username}, function (err,body){
        if (!err){
            callback(body.rows[0]);
        }
    });   
}



exports.uniqueUser = function (email,callback){
    activeDb.view('web_to_do_views','get_users',{key: email}, function (err,body){
        if (!err){
            if (body.rows[0]){
                callback(false);
            } else {
                callback(true);
            }
        }
    });
}



exports.uniqueTwitterUser = function (username, callback){
    activeDb.view('web_to_do_views','get_users_twitter', {key: username}, function (err, body){
        if (!err){
            if (body.rows[0]){
                callback(false);
            } else {
                callback(true);
            }
        }
    });
}



exports.getToDosById = function (id, callback){
    activeDb.view('web_to_do_views','get_todos', {key: id}, function (err, body){
        if (!err){
            callback(body.rows);
        }
    });
}