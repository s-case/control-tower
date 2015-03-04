// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var appcheck = express();
var userrouter = express.Router();
var port     = process.env.PORT || 3000;
//var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');

// configuration ===============================================================
//mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: 'SCASEbringsRESTtoyou' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport
require('./app/routeAuth.js')(app, passport);//load the routes for the Authentication and authorization
require('./app/routeUnlink.js')(app, passport);//load the route for unlinking the account
require('./app/routeDeleteAcc.js')(app, passport);//load the route for deleting the account
require('./app/routeRefreshToken.js')(app, passport);//load the route for refreshing the s-case token
require('./app/routeDispProjOwn.js')(app, passport);//load the route for displaying the projects I own
require('./app/routeDispProjOwnSpecific.js')(app, passport);//load the route for displaying the info of a specific project I own
require('./app/routeDeleteProjOwnSpecific.js')(app, passport);//load the route for deleting a specific project I own
require('./app/routeDispProjCollab.js')(app, passport);//load the route for displaying the projects I collaborate
require('./app/routeDispProjCollabSpecific.js')(app, passport);//load the route for displaying the info of a a specific project I collaborate
require('./app/routeRemoveCollabProjOwnSpecific.js')(app, passport);//load the route for removing a collaborator from a project I own (or to remove myself as a collaborator)
require('./app/routeRemoveOwnProjOwnSpecific.js')(app, passport);//load the route for removing an owner from a project I own 
require('./app/routeCreateProjOwnSpecific.js')(app, passport);//load the route for creating a project I own 
require('./app/routeAddOwnProjOwnSpecific.js')(app, passport);//load the route for adding an owner in a project I own 
require('./app/routeAddCollabProjOwnSpecific.js')(app, passport);//load the route for adding a collaborator in a project I own 
//check if a user is Valid (API) route
require('./app/checkUser.js') (app);
//functionallities (API) route
require('./app/functionallitiesAPI.js') (app);
//app.use('/api',userrouter);

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
