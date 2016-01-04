/**
 * Module dependencies.
 */
var express = require('express');
var cookieParser = require('cookie-parser');
var compress = require('compression');
var favicon = require('serve-favicon');
var session = require('express-session');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var errorHandler = require('errorhandler');
var lusca = require('lusca');
var methodOverride = require('method-override');

var _ = require('lodash');
var MongoStore = require('connect-mongo')(session);
var flash = require('express-flash');
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var expressValidator = require('express-validator');
var sass = require('node-sass-middleware');
var oauth2 = require('./config/oauth2');

var methodOverride = require('method-override')


/**
 * Controllers (route handlers).
 */
var homeController = require('./controllers/home');
var userController = require('./controllers/user');
var apiController = require('./controllers/oauth');
var contactController = require('./controllers/contact');
var mailboxController = require('./controllers/mailbox');

/**
 * Create Express server.
 */
var app = express();

/**
 * API keys and Passport configuration.
 */
var secrets = require('./config/secrets');
var passportConf = require('./config/passport');



/**
 * Connect to MongoDB.
 */
mongoose.connect(secrets.db);
mongoose.connection.on('error', function() {
  console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
  process.exit(1);
});

/**
 * Express configuration.
 */
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(compress());
app.use(sass({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  debug: true,
  outputStyle: 'expanded'
}));
app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(methodOverride());
app.use(cookieParser());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: secrets.sessionSecret,
  store: new MongoStore({ url: secrets.db, autoReconnect: true })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(lusca({
  xframe: 'SAMEORIGIN',
  xssProtection: true
}));
app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
});
app.use(function(req, res, next) {
  if (/oauth/i.test(req.path)) {
    req.session.returnTo = req.path;
  }
  next();
});
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

app.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}))


// Routes
require('./routes/oauth')(app, oauth2, passport, apiController, passportConf);
require('./routes/website')(app, oauth2, passport, homeController, userController, passportConf, contactController, mailboxController);


/**
 * Error Handler.
 */
if ('development' == app.get('env')) {
   app.use(errorHandler({ dumpExceptions: true, showStack: true }));
   morgan('combined', {
     skip: function (req, res) { return res.statusCode < 400 }
  })
 };

if ('production' == app.get('env')) {
  app.use(errorHandler());
    morgan('combined', {
    skip: function (req, res) { return res.statusCode < 400 }
  })
 };
/**
 * Start Express server.
 */
 app.listen(app.get('port'), '127.0.0.1', function() {
   console.log('Express server listening on localhost port %d in %s mode', app.get('port'), app.get('env'));
 });

 // Docker IP
var docker_ip = app.listen(app.get('port'), '172.17.42.1');
docker_ip.on('error', function(err){
    console.log(err)
})

module.exports = app;
