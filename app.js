
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
  // , search = require('./routes/search')
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
// app.get('/search',search.info);
app.post('/login', auth.login );
app.post('/register', auth.register);

io.sockets.on('connection',function(socket){
  socket.on('addToDo', function(data){
    var item = data.data;
    var todo = {
      'type' : 'todo_item',
      'user' : {
        'email' : item.user,
        '_id'  : item._id,
      },
      'todo' : item.todo,
      'duedate': item.duedate,
      'priority' : item.priority
    }
    // console.log(todo);
    db.insert(todo);
  });
});

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
