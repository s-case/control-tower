module.exports = function(app, passport) {
	
	var mysql = require('mysql');
	var dbconfig = require('../config/database');
	//var connection = mysql.createConnection(dbconfig.connection);
	//var connection = require('../config/ConnectConstant.js');
	var connection;
	//function to handle the disconnects from the MySQL db
	var connConstant = require('../config/ConnectConstant');
	var ownerflag;//flag used to check if the user is an owner
	//function to check if the user is owner of a specific project
	function checkIfOwner(user,proj_name,callback){
		connConstant.handleDisconnect();
		var selectProjects = "SELECT `project_name` FROM " + dbconfig.projects_table +" JOIN " + dbconfig.owners_table + " ON "+ dbconfig.projects_table+
		".`project_id` = "+ dbconfig.owners_table + ".`project_id` "+" WHERE "+ dbconfig.owners_table+".`user_id` = '" + user.id + "'";
		console.log(selectProjects)
		connection.query(selectProjects, function(err, rows){
			if (rows.length > 0) {
            	for(var i in rows){
        			if(rows[i].project_name==proj_name){
        				ownerflag=true;
        			}
            	}
	        }
	        console.log(ownerflag);
	        callback(ownerflag);
		});
	}
	
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

	// PROFILE SECTION =========================
	app.get('/profile_alert', isLoggedIn, function(req, res) {
		res.render('profile_alert.ejs', {
			user : req.user
		});
	});
	// LOGOUT ==============================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
};

// route middleware to ensure user is logged i
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();

	res.redirect('/');
}
