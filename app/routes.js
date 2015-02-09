module.exports = function(app, passport) {

// normal routes ===============================================================

	// show the home page (will also have our login links)
	app.get('/', function(req, res) {
		res.render('index.ejs');
	});

	// PROFILE SECTION =========================
	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile.ejs', {
			user : req.user
		});
	});

	// LOGOUT ==============================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

	
	// github -------------------------------

		// send to github to do the authentication
		app.get('/auth/github', passport.authenticate('github', { scope : 'email' }));

		// handle the callback after github has authenticated the user
		app.get('/auth/github/callback',
			passport.authenticate('github', {
				successRedirect : '/profile',
				failureRedirect : '/'
			}));

// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

	
	// github -------------------------------

		// send to github to do the authentication
		app.get('/connect/github', passport.authorize('github', { scope : 'email' }));

		// handle the callback after github has authorized the user
		app.get('/connect/github/callback',
			passport.authorize('github', {
				successRedirect : '/profile',
				failureRedirect : '/'
			}));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

	var mysql = require('mysql');
	var dbconfig = require('../config/database');
	//var connection = mysql.createConnection(dbconfig.connection);
	var connection = require('../config/ConnectConstant.js');
	connection.query('USE ' + dbconfig.database);

	// github -------------------------------
	app.get('/unlink/github', isLoggedIn, function(req, res) {

		
		var user            = req.user;
		var updateQuery = "UPDATE " + dbconfig.users_table + " SET " +
                                "`github_token` = '" + undefined + "' " +                               
                                "WHERE `github_id` = " + user.github_id + " LIMIT 1";
		connection.query(updateQuery, function(err, rows) {
                                res.redirect('/profile');
                            });
	});


};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();

	res.redirect('/');
}
