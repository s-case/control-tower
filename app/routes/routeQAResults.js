module.exports = function(app, passport) {
	
	var mysql = require('mysql');
	var dbconfig = require('../../config/database');
	var connConstant = require('../../config/ConnectConstant');
	// =============================================================================
	// Got to QA ======================================
	// =============================================================================
	app.get('/QA', isLoggedIn, function(req, res) {
		res.render('QA.html')
	});
};
// route middleware to ensure user is logged i
function isLoggedIn(req, res, next) {
	var connConstant = require('../../config/ConnectConstant');
	var connection;
	connection = connConstant.connection;
	if (req.isAuthenticated())
		return next();

	res.redirect('/');
}
