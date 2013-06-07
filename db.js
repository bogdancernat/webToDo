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
            'get_todos_by_id':{
                'map': function (doc) {
                    if (doc.type=='todo_item'){
                        emit(doc.uniqueId, doc);
                    }
                }
            },
            'get_todos_by_date':{
                'map': function (doc) {
                    if (doc.type=='todo_item'){
                        emit(doc.duedate, doc);
                    }
                }
            },
            'get_projects_by_id':{
                'map': function (doc) {
                    if (doc.type=='project'){
                        emit(doc.uniqueId, doc);
                    }
                }
            },
            'get_todos_by_project_id':{
                'map': function (doc) {
                    if (doc.type=='todo_item'){
                        emit([doc.project, doc.user._id], doc);
                    }
                }
            },
            'get_projects_by_user_name':{
                'map': function (doc) {
                    if (doc.type=='project')
                        emit([doc.user._id, doc.name], doc)
                }
            },
            'get_projects_by_user_id':{
                'map': function (doc) {
                    if (doc.type=='project')
                        emit(doc.user._id, doc);
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
}



exports.insert = function (obj, callback){
    activeDb.insert(obj,function (err, body, header){
        if (err){
            throw (err);
        } else {
            console.log('inserted');
            console.log(obj);
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



exports.uniqueUser = function (email, callback){
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



exports.getToDosById = function (id, callback){
    activeDb.view('web_to_do_views','get_todos', {key: id}, function (err, body){
        if (!err){
            callback(body.rows);
        }
    });
}



exports.getToDosByUniqueId = function (id, callback){
    activeDb.view('web_to_do_views', 'get_todos_by_id', {key: id}, function (err, body){
        if (!err){
            callback(body.rows[0]);
        }
    });
}



exports.searchUsers = function (email, callback){
    activeDb.view('web_to_do_views', 'get_users', {startkey: email, endkey: email + '\u9999'}, function (err, body){
        if (!err)
            callback(body.rows);
    });
}


exports.getToDosByDate = function (duedate, callback){
    activeDb.view('web_to_do_views', 'get_todos_by_date', {key: duedate}, function (err, body){
        if (!err){
            callback(body.rows);
        } else 
            console.log(err);
    });
}



exports.updateToDo = function (field, value, key){
    this.getToDosByUniqueId(key, function (resp) {
        if(!resp) {
          return console.log("I failed");
        }

        switch(field){
            case 'percentage':
                if (value == '100')
                    resp.value.priority = 'done';
                break;
            case 'priority':
                if (resp.value.priority == 'done')
                    resp.value.percentage = 0;
                if (value == 'done')
                    resp.value.percentage = 100;
                break;
        }


        if (field == 'notes_delete') {
            console.log(resp.value['notes'].length - parseInt(value));
            resp.value['notes'].splice(resp.value['notes'].length - parseInt(value) - 1, 1);
        }

        if (field != 'notes') {
            resp.value[field] = value;
        } else
            resp.value[field][resp.value[field].length] = value;

        activeDb.insert(resp.value, resp.value._id, function (error, response) {
            if(!error) {
                console.log("it worked");
            } else {
                console.log(error);
            }
        });
    });
}



exports.removeToDo = function(key, callback){
    this.getToDosByUniqueId(key, function (resp) {
        if(!resp) {
          return console.log("I failed");
        }

        activeDb.destroy(resp.value._id, resp.value._rev, function (error, body) {
            if(!error) {
                callback(body);
            } else {
                console.log(error);
            }
        });
    });    
}


exports.removeProject = function(key, callback){
    this.getProjectsById(key, function (resp) {
        if(!resp) {
          return console.log("I failed");
        }

        activeDb.destroy(resp.value._id, resp.value._rev, function (error, body) {
            if(!error) {
                callback(body);
            } else {
                console.log(error);
            }
        });
    });    
}


exports.getProjectsById = function (id, callback){
    activeDb.view('web_to_do_views', 'get_projects_by_id', {key: id}, function (err, body){
        if (!err){
            callback(body.rows[0]);
        } else 
            console.log(err);
    });
}


exports.getProjectsByUserAndName = function (userID, name, callback){
    activeDb.view('web_to_do_views', 'get_projects_by_user_name', {key: [userID, name]}, function (err, body){
        if (!err){
            callback(body.rows);
        } else 
            console.log(err);
    });   
}


exports.getToDosByProjectAndUser = function (projectName, userID, callback){
    activeDb.view('web_to_do_views', 'get_todos_by_project_id', {key: [projectName, userID]}, function (err, body){
        if (!err){
            callback(body.rows);
        } else 
            console.log(err);
    });    
}



exports.getProjectsByUserId = function (userID, callback){
    activeDb.view('web_to_do_views', 'get_projects_by_user_id', {key: userID}, function (err, body){
        if (!err){
            callback(body.rows);
        } else 
            console.log(err);
    });
}