module.exports = function(app, passport) {
	
	var mysql = require('mysql');
	var dbconfig = require('../../config/database');
	var connConstant = require('../../config/ConnectConstant');
	//var connection = mysql.createConnection(dbconfig.connection);
	//var connection = require('../config/ConnectConstant.js');
	var connection;
	// =============================================================================
	// Display Projects I own, allow to manage and allow to remove =================
	// =============================================================================
	app.get('/displayOwnprojects', isLoggedIn, function(req, res) {
		var user            = req.user;
		connection = connConstant.connection;
		//query for the projects I own
		var projectsOwnedQuery = "SELECT `project_name` FROM " + dbconfig.projects_table +" JOIN " + dbconfig.owners_table + " ON "+ dbconfig.projects_table+
			".`project_id` = "+ dbconfig.owners_table + ".`project_id` "+" WHERE "+ dbconfig.owners_table+".`user_id` = '" + user.id + "'";
		console.log(projectsOwnedQuery);
		connection.query(projectsOwnedQuery, function(err, rows){
            //if(rows){
	            if (rows.length > 0) {
	            	res.render('projectsOwn.ejs', {
						projectnames : rows,//I return the project names in order to be able to remove them
						user: user
					});
	            }
        	//
            else{
            	res.redirect('/profile');
            }
        });
	});
};
// route middleware to ensure user is logged i
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
