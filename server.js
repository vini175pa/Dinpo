var express = require('express')
  , path = require('path')
  , logger = require('morgan')
  , bodyParser = require('body-parser')
  , log = require('debug')('Dinpo:server')
  , log_error = require('debug')('Dinpo:error')
  , http = require('http')
  , passport = require('passport')
  , User = require("./models/User")
  , LocalStrategy = require('passport-local').Strategy
  , session = require("express-session")
  , MongoStore = require("connect-mongo")(session)
  , app = express();


log("Attempt to load from config.json");
try{
  config = require("./config.json");
}catch (err) {
  log_error("Failed to load file config.json %j", err);
  return;
}

var mongoose = require("./lib/DBConnection")(config);

log('Save configuration values in app %j', config);
app.set('config', config);

log('Setting port as %d', config.PORT);
app.set('port', config.PORT || "3000");

log('Setting view engine as %s', 'jade');
app.set('view engine', 'jade');

log('Setting views lookup root path.');
app.set('views', path.join(__dirname, 'views'));


log('Save Express Session instance in app');
app.set("sessionMiddleware", session({
  name: config.KEY,
  secret: config.SECRET,
  resave: true,
  saveUninitialized: true,
  rolling: true,
  store: new MongoStore({mongooseConnection:mongoose.connection}),
  cookie: {
      httpOnly: false,
      secure: false,
      maxAge:86400000
  }
}));

log('Use of express session middleware.');
app.use(app.get("sessionMiddleware"));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

log('Use of express cookie parser middleware.');
app.use(require('cookie-parser')(config.SECRET));

log('Setting static files lookup root path.');
app.use(express.static(path.join(__dirname, 'dist')));

log("Initializing passport")
app.use(passport.initialize());
app.use(passport.session());

log("Setting LocalStrategy and configuring the authentification")
passport.use(
  new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  User.authenticate()
));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


log('Use of express router.');
app.use('/', require('./routes')(passport));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  console.log(err);
  res.status(err.status || 500);
  res.json({error: err, message: err.message});
});


log("Creating server");
var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(app.get("port"));
server.on('error', onError);
server.on('listening', onListening);

/**
 * Includes socket.io
 */

require("./sockets")(app, server);


function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + app.get("port");

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      log_error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      log_error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}


function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  log('Listening on ' + bind);
}

