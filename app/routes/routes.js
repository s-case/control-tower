module.exports = function(app, passport) {
	var mysql = require('mysql');
	var dbconfig = require('../../config/database');
	var connConstant = require('../../config/ConnectConstant');
	//var connection = mysql.createConnection(dbconfig.connection);
	//var connection = require('../config/ConnectConstant.js');
	var connection;
	// normal routes ===============================================================

	// show the home page (will also have our login links)
	app.get('/', function(req, res) {
		connection = connConstant.connection;
		res.render('index.ejs');
	});

	// PROFILE SECTION =========================
	app.get('/profile', isLoggedIn, function(req, res) {
		connection = connConstant.connection;
		res.render('profile.ejs', {
			user : req.user
		});
	});

	// PROFILE SECTION =========================
	app.get('/profile_alert', isLoggedIn, function(req, res) {
		connection = connConstant.connection;
		res.render('profile_alert.ejs', {
			user : req.user
		});
	});
	// LOGOUT ==============================
	app.get('/logout', function(req, res) {
		connection = connConstant.connection;
		req.logout();
		res.redirect('/');
	});
};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
	var connConstant = require('../../config/ConnectConstant');
	var connection;
	connection = connConstant.connection;
	if (req.isAuthenticated()){
		return next();
	}
	else{
		res.redirect('/');
	}
}
