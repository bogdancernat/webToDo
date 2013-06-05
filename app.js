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
app.get('/loginGoogle', auth.loginWithGoogle);
app.get('/loginTwitter', auth.loginWithTwitter);
app.get('/register', auth.registerPage);
app.get('/logout',auth.logout);
app.post('/login', auth.login );
app.post('/register', auth.register);



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


    //return == notifica utilizatorul; schimbam;
    socket.on('addToDo', function (data){
        var item = data.data;
        var hourRe = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/;
        var date, today;
        var todayMinutes, todayHours;

        if (item.todo === '')
            return;

        if (item.dueTime != null && hourRe.exec(item.dueTime) == null)
            return;

        if (item.dueDate != null) {
            if (!Date.parse(item.dueDate))
                return;

            date = new Date(item.dueDate);

            item.dueDate = date.getUTCFullYear() + "/" + (date.getUTCMonth() + 1) + "/" + date.getUTCDate();

            today = new Date();

            todayMinutes = today.getMinutes();
            todayHours = today.getHours();

            date.setHours(0, 0, 0, 0);
            today.setHours(0, 0, 0, 0);

            if (today > date)
                return;
            else if (today.getTime() == date.getTime()) { //daca dueDate = ziua curenta atunci compar ora si minutele
                if (item.dueTime != null) {
                    var tokens = item.dueTime.split(':');
                    var hours = parseInt(tokens[0]);
                    var minutes = parseInt(tokens[1]);

                    if (todayHours > hours)
                        return;
                    else if (todayHours == hours) {
                        if (todayMinutes >= minutes)
                            return;
                    }

                } else 
                    return //daca dueDate = ziua curenta si ora nu este setata, nu putem adauga to-do-ul deoarece nu stim ora la care trebuie sa il notificam
            }
        } else if (item.dueTime != null) { //daca nu este setata data si este setat timpul, dueDate va fi data curenta(ziua curenta); daca a trecut ora respectiva atunci va primi eroare
            var tokens = item.dueTime.split(':');
            var hours = parseInt(tokens[0]);
            var minutes = parseInt(tokens[1]);

            today = new Date();

            todayMinutes = today.getMinutes();
            todayHours = today.getHours();

            if (todayHours > hours)
                return;
            else if (todayHours == hours) {
                if (todayMinutes >= minutes)
                    return;
                else
                    item.dueDate = today.getUTCFullYear() + "/" + (today.getUTCMonth() + 1) + "/" + today.getUTCDate();
            } else {
                item.dueDate = today.getUTCFullYear() + "/" + (today.getUTCMonth() + 1) + "/" + today.getUTCDate();
            }           
        }

        var todo = {
            'type' : 'todo_item',
            'user' : {
                '_id'  : item._id
             },
            'todo' : item.todo,
            'duedate': item.dueDate,
            'duetime': item.dueTime,
            'priority' : item.priority
        }

        db.insert(todo,function(){
            // callback
        });
    });


    
    socket.on('validateLoginData', function (data){
        console.log(data);
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
});



server.listen(app.get('port'), function (){
  console.log('Express server listening on port ' + app.get('port'));
});