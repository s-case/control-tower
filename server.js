// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var appcheck = express();
var userrouter = express.Router();
var port       = 3000;
//var port     = process.env.PORT || 3000;
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

//app.set("view options", {layout: false});
//

app.set('view engine', 'ejs'); // set up ejs for templating
app.use(express.static(__dirname + '/views'));
app.engine('html', require('ejs').renderFile);

// required for passport
app.use(session({ secret: process.env.SCASE_SECRET })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
app.get('/ApiDocumentation', function(req, res) {
		res.render('S-CASE control tower api.html')
	});
// routes ======================================================================
require('./app/routes/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport
require('./app/routes/routeAuth.js')(app, passport);//load the routes for the Authentication and authorization
require('./app/routes/routeUnlink.js')(app, passport);//load the route for unlinking the account
require('./app/routes/routeDeleteAcc.js')(app, passport);//load the route for deleting the account
require('./app/routes/routeRefreshToken.js')(app, passport);//load the route for refreshing the s-case token
require('./app/routes/routeRefreshSecret.js')(app, passport);//load the route for refreshing the s-case secret
require('./app/routes/routeDispProjOwn.js')(app, passport);//load the route for displaying the projects I own
require('./app/routes/routeDispProjOwnSpecific.js')(app, passport);//load the route for displaying the info of a specific project I own
require('./app/routes/routeDeleteProjOwnSpecific.js')(app, passport);//load the route for deleting a specific project I own
require('./app/routes/routeDispProjCollab.js')(app, passport);//load the route for displaying the projects I collaborate
require('./app/routes/routeDispProjCollabSpecific.js')(app, passport);//load the route for displaying the info of a a specific project I collaborate
require('./app/routes/routeRemoveCollabProjOwnSpecific.js')(app, passport);//load the route for removing a collaborator from a project I own (or to remove myself as a collaborator)
require('./app/routes/routeRemoveOwnProjOwnSpecific.js')(app, passport);//load the route for removing an owner from a project I own 
require('./app/routes/routeCreateProjOwnSpecific.js')(app, passport);//load the route for creating a project I own 
require('./app/routes/routeAddOwnProjOwnSpecific.js')(app, passport);//load the route for adding an owner in a project I own 
require('./app/routes/routeAddCollabProjOwnSpecific.js')(app, passport);//load the route for adding a collaborator in a project I own
require('./app/routes/routeChangeProjectsPrivacy.js')(app, passport);//load the route for changing the privacy level of a project I own 
require('./app/routes/routeChangeProjectsDomainSubdomain.js')(app, passport);//load the route for changing the domains and subdomains of a project I own 
require('./app/routes/routeGetProjectsDomainSubdomain.js')(app, passport);//load the route for getting the domains and subdomains of a project I own
require('./app/routes/routeQAResults.js') (app);//access the QA
require('./app/routes/routeGetRequestsProxy.js') (app);
require('./app/routes/routePostRequestsProxy.js') (app);
//================API routes=============================
require('./app/api/checkUserValidityAPI.js') (app);//check if a user is Valid (API) route
require('./app/api/deleteAccAPI.js') (app);//delete account
require('./app/api/refreshSCaseTokenAPI.js') (app);//refresh S-CASE token
require('./app/api/refreshSCaseSecretAPI.js') (app);//refresh S-CASE secret
require('./app/api/dispProjOwnAPI.js') (app);//display the projects I own
require('./app/api/dispProjOwnersCollabsAPI.js') (app);//display the owners of a project I own
require('./app/api/dispProjCollabAPI.js') (app);//display the collaborators of a project I own
require('./app/api/deleteProjOwnAPI.js') (app);//delete a project I own
require('./app/api/removeCollabProjOwnAPI.js') (app);//remove a collaborator from a Project I own
require('./app/api/removeOwnerProjOwnAPI.js') (app);//remove an owner from a project I own
require('./app/api/addOwnerProjOwnAPI.js') (app);//add an owner to a project I own
require('./app/api/addCollabProjOwnAPI.js') (app);//add a collaborator to a project I own
require('./app/api/createProjOwnAPI.js') (app);//create a project I own
require('./app/api/changePrivacyProjOwnAPI.js') (app);//change privacy level in a project I own
require('./app/api/changeDomainSubdomainProjOwnAPI.js') (app);//change domain and subdomain in a project I own
require('./app/api/checkUserRoleForProjectAPI.js') (app);//check the role (Owner or Collaborator) of a user in a project
// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
