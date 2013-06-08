/**
 * Module dependencies.
 */
var express = require('express')
    , http = require('http')
    , app = express()
    , server = http.createServer(app)
    , routes = require('./routes')
    , user = require('./routes/user')
    , auth = require('./routes/auth')
    , search = require('./routes/search')
    , path = require('path')
    , db = require('./db')
    , io = require('socket.io').listen(server) 
    , cookie = require('cookie')
    , nodemailer = require("nodemailer")
    , cronJob = require('cron').CronJob
    , Twit = require('twit')
    , twitterClient = new Twit({
                            consumer_key:         's6wF0QuG4mRhwaZCWswA'
                          , consumer_secret:      'TfLKblLHtYe6sAr5iOy2deSdbSdwQVYTjuGoBsgu9A'
                          , access_token:         '1104145118-zLyqFVjLMIjCQRIWTQDNDOfkB9qVkwycZrLTbYk'
                          , access_token_secret:  'fc8AxQ9TCcg2vDfTQf1L2IyzDvXVh3mVphDQxREOw'
                        })

    ;
  


var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: "webtodopp@gmail.com",
        pass: "localhost"
    }
});



// all environments
app.configure(function(){
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.set('view options', { pretty: true });
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('bestappevur'));
    app.use(express.session());
    app.use(auth.passport.initialize());
    app.use(auth.passport.session());
    app.use(app.router);
    app.use(require('stylus').middleware(__dirname + '/public'));
    app.use(express.static(path.join(__dirname, 'public')));
});



// development only
app.configure('development', function(){
    app.use(express.errorHandler());
});



app.get('/', routes.index);
app.get('/users', user.list);
app.get('/loginGoogle', auth.loginWithGoogle);
app.get('/loginTwitter', auth.loginWithTwitter);
app.get('/logout',auth.logout);
app.post('/login', auth.login );
app.post('/register', auth.register);




var job = new cronJob('0 0 * * *', function(){
    var today = new Date();                
    var todayString;

    todayString = today.getUTCFullYear() + "/" + (today.getUTCMonth() + 1) + "/" + today.getDate();

    db.getToDosByDate(todayString ,function (resp){
        if (resp) {

            var length = resp.length;

            for (var counter = 0; counter < length; counter++){
                
                if (resp[counter].value.loggedIn === '#notLogged#')    
                    continue;

                if (resp[counter].value.loggedIn.indexOf('@') != -1) {
                    
                    var mailOptions = {
                        from: "WebToDo++ ✔ <webtodopp@gmail.com>", // sender address
                        to: resp[counter].value.loggedIn, // list of receivers
                        subject: "WebToDo++ notification", // Subject line
                        text: 'Hello, ' + '\n' + 'Your to do is due today: ' + resp[counter].value.todo // plaintext body
                    };

                    smtpTransport.sendMail(mailOptions, function(error, response){
                        if(error){
                            console.log(error);
                        } else {
                            console.log("Mail sent: " + response.message);
                        }
                    });
                } else {
                    var pm = 'Hi, your to do is due today: ' + resp[counter].value.todo;  
                    twitterClient.post('direct_messages/new', {'screen_name': resp[counter].value.loggedIn, 'text': pm}, function(err, reply) {
                            if (!err) {
                                console.log('Direct message sent...');
                            } else {
                                console.log(err);
                            }
                    });
                }
            }
        }
    });
  }, function () {
    console.log('Finished sending mails...')
  }, 
  true /* Start the job right now */
);



io.of('/shared').on('connection', function (socket) {


    socket.on('validateEmail', function (data){
        data.email = data.email.replace(/\s/g,'');
        data.email = data.email.toLowerCase();

        db.uniqueUser(data.email, function (itIs){
            var matches = data.email.match("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?");
            if (matches == null || matches.length != 1) 
                itIs = false;

            data.isValid = itIs; 
            socket.emit('validationResult', data);  
        });
    });



    socket.on('validatePass', function (data){
        var isValid = true;
        if (data.password.length < 6 || data.password.length > 32)
            isValid = false;

        data.isValid = isValid;
        socket.emit('validationResult', data);
    });




    socket.on('validateConfPass', function (data){
        var isValid = true;

        if (data.password != data.rePassword)
            isValid = false;

        data.isValid = isValid;

        socket.emit('validationResult', data);
    });


    //return == notifica utilizatorul; schimbam;
    socket.on('addToDo', function (data){
        var item = data.data;

        var date, today;


        if (item.todo === '' || item.todo.length > 35) {
            socket.emit('addToDoError', {error: 'no to do item'});
            return;
        }

        if (item.dueDate != null) {
            if (!Date.parse(item.dueDate)){
                socket.emit('addToDoError', {error: 'invalid date format'});
                return;
            }

            date = new Date(item.dueDate);

            item.dueDate = date.getUTCFullYear() + "/" + (date.getUTCMonth() + 1) + "/" + date.getDate();

            today = new Date();

            date.setHours(0, 0, 0, 0);
            today.setHours(0, 0, 0, 0);

            if (today > date){
                socket.emit('addToDoError', {error: 'invalid due date'});
                return;
            }
        } 


        var id = (new Date()).getTime().toString(16);

        var cookies = cookie.parse(socket.handshake.headers.cookie);
        var cookieString, loggedIn = false;

        if (cookies.todo_logged_in != null) {
            cookieString = cookies.todo_logged_in;
            loggedIn = true;
        } else  if (cookies.todo_memory != null)
            cookieString = cookies.todo_memory;
                else
                    return;


        getCookie(cookieString, function (cookJson){
            var user, email;

            if (loggedIn == true) {
                user = cookJson.user;
            } else 
                user = '#notLogged#';

            var todo = {
                'type' : 'todo_item',
                'user' : {
                    '_id'  : cookJson._id
                 },
                'todo' : item.todo,
                'duedate': item.dueDate,
                'priority': item.priority,
                'loggedIn': user,
                'percentage': 0,
                'uniqueId': id,
                'notes': [],
                'project': item.project
            };

            db.insert(todo,function(){
                socket.emit('validToDo', todo);            
            });
        });
    });
    

    
    socket.on('validateLoginData', function (data){
        db.getUser(data['email'], function (resp){
            if(resp){
                auth.getHash(data, function(user){
                    if (resp.value['password'] == data['password']) {
                        socket.emit('loginValidationResult', {result: 'ok'});    
                    } else {
                        socket.emit('loginValidationResult', {result: 'invalid_password'});           
                    }
                });
            } else {
                socket.emit('loginValidationResult', {result: 'invalid_email'});
            }
        });
    });



    socket.on('findUsers', function (data){
        db.searchUsers(data.email, function (resp){
            if (resp){
                socket.emit('takeUsers', {users: resp});
            }
        });
    });


    socket.on('changeProgress', function(data){
        console.log(data);
        db.updateToDo('percentage', data.value, data.uniqueId);
    });


    socket.on('changePriority', function(data){
        console.log(data);
        db.updateToDo('priority', data.value, data.uniqueId);
    });

    socket.on('markDone', function(data){
        console.log(data);
        db.updateToDo('priority', 'done', data.uniqueId);
    });

    socket.on('deleteToDo', function(data){
        db.removeToDo(data.uniqueId, function(resp){
            console.log(resp);
        });
    });

    socket.on('addToDoNote', function(data){
        if (data.value.length == 0)
            return;

        db.updateToDo('notes', data.value, data.uniqueId);
    });


    socket.on('deleteToDoNote', function(data){
        db.updateToDo('notes_delete', data.index, data.uniqueId);
    });

    socket.on('giveMeProjects', function(data){
        var cookies = cookie.parse(socket.handshake.headers.cookie);
        var cookieString;

        if (cookies.todo_logged_in != null) 
            cookieString = cookies.todo_logged_in;
        else if (cookies.todo_memory != null)
            cookieString = cookies.todo_memory;
        else
            return;

        getCookie(cookieString, function (cookJson){

            db.getProjectsByUserId(cookJson._id, function (resp){
                if(resp){
                    socket.emit('takeProjects', { projects: resp});                
                }
            });
        });    
    });

    socket.on('removeProject', function (data){

        db.removeProject(data.uniqueId, function(resp){
            console.log(resp);
        });
    });

    socket.on('addProject', function(data){
        var id = (new Date()).getTime().toString(16);

        var matches = data.name.match('^[a-z0-9]+$');

        if (matches == null || matches.length != 1) 
            return;

        if (data.name.length > 20)
            return;

        var cookies = cookie.parse(socket.handshake.headers.cookie);
        var cookieString, loggedIn = false;

        if (cookies.todo_logged_in != null) {
            cookieString = cookies.todo_logged_in;
            loggedIn = true;
        } 

        getCookie(cookieString, function (cookJson){
            var project = {
                type: 'project',
                user: {
                    _id: cookJson._id
                },
                name: data.name,
                uniqueId: id,
            }


            db.insert(project, function (){
                socket.emit('validProject', project);
            });
        });
    });

});


io.of('/toDos').on('connection', function (socket){
    var id;

    socket.on('giveMeToDos', function (data){
        var cookies = cookie.parse(socket.handshake.headers.cookie);
        var cookieString;

        if (cookies.todo_logged_in != null) 
            cookieString = cookies.todo_logged_in;
        else if (cookies.todo_memory != null)
            cookieString = cookies.todo_memory;
        else
            return;

        getCookie(cookieString, function (cookJson){

            db.getToDosByProjectAndUser('#untitled', cookJson._id, function (resp){
                if(resp){
                    socket.emit('takeToDos', { toDos: resp});                
                }
            });
        });
    });

    socket.on('giveMeToDosByProjectID', function(data){
        var cookies = cookie.parse(socket.handshake.headers.cookie);
        var cookieString;

        if (cookies.todo_logged_in != null) 
            cookieString = cookies.todo_logged_in;
        else if (cookies.todo_memory != null)
            cookieString = cookies.todo_memory;
        else
            return;

        getCookie(cookieString, function (cookJson){

            db.getToDosByProjectAndUser(data.uniqueId, cookJson._id, function (resp){
                if(resp){
                    socket.emit('takeToDos', { toDos: resp});                
                }
            });
        });
    });
});


function getToDosAhead(userID, callback){
    db.getToDosByUserWithDuedate(userID, function (resp){
        if(resp){
            var dates = [];
            var length = resp.length;
            var today = new Date();

            today.setHours(0, 0, 0, 0);

            for (var counter = 0; counter < length; counter++){
                var date = new Date(resp[counter].value.duedate);

                date.setHours(0, 0, 0, 0);

                if (today <= date)
                    dates.push(resp[counter].value);
            }

            dates.sort(function (a, b){
                var date1 = new Date(a.duedate);
                var date2 = new Date(b.duedate);

                return (date1<date2?-1:date1>date2?1:0);
            });

            console.log(dates);

            callback(resp);
        }
    });    
} 


server.listen(app.get('port'), function (){
  console.log('Express server listening on port ' + app.get('port'));
});



function getCookie(cookie, callback) {
    var cookJson = null;

    if (cookie){
        var startPos = cookie.indexOf('{');
        var stopPos = 0;

        for (var i = cookie.length - 1; i >= 0; i--) {
            if (cookie[i] == '}'){
                stopPos = i+1;
                break;
            }
        }

        cookJson = JSON.parse(cookie.substring(startPos,stopPos));
    }

    callback(cookJson);
}