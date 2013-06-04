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
  ;
  

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
app.get('/login', auth.loginPage);
app.get('/register', auth.registerPage);
app.get('/logout',auth.logout);
app.get('/loginGoogle', auth.loginWithGoogle);
app.post('/login', auth.login );
app.post('/register', auth.register);
app.get('/loginTwitter', auth.loginWithTwitter);


io.sockets.on('connection', function (socket) {

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
  



    socket.on('addToDo', function (data){
        var item = data.data;
        var todo = {
            'type' : 'todo_item',
            'user' : {
                'email' : item.user,
                '_id'  : item._id,
             },
            'todo' : item.todo,
            'duedate': item.dueDate,
            'priority' : item.priority
        }

        db.insert(todo);
    });
});



server.listen(app.get('port'), function (){
  console.log('Express server listening on port ' + app.get('port'));
});