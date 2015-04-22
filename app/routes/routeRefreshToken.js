module.exports = function(app, passport) {
	
	var mysql = require('mysql');
	var dbconfig = require('../../config/database');
	var connConstant = require('../../config/ConnectConstant');
	//var connection = mysql.createConnection(dbconfig.connection);
	//var connection = require('../config/ConnectConstant.js');
	var connection;
	
	var ownerflag;//flag used to check if the user is an owner
	//function to check if the user is owner of a specific project
	function checkIfOwner(user,proj_name,callback){
		connection=connConstant.connection;
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

	// =============================================================================
	// Refresh S-CASE token ACCOUNTS ===============================================
	// =============================================================================
	//we create a new scase token
	var crypto = require('crypto');
	var base64url = require('base64url');
	//function to crete an S-CASE token
	function scasetokenCreate(size){
	    return base64url(crypto.randomBytes(size));
	}
	//we create the route to refresh the token
	app.get('/refreshscasetoken', isLoggedIn, function(req, res) {
		var user            = req.user;
		connection=connConstant.connection;
		//we select the user from the user's table (just to check if the user exists)
		connection.query("SELECT * FROM " + dbconfig.users_table + " WHERE id = '" + user.id + "'", function(err, rows){
            if (rows.length > 0) {
                user = rows[0];
                var scasetoken = scasetokenCreate(35)//we create a new scase token
                user.scase_token=scasetoken;
                //we update the token
                var updateQuery = "UPDATE " + dbconfig.users_table + " SET " +
                        "`scase_token` = '" + user.scase_token + "' " +
                        "WHERE `id` = '" + user.id + "' LIMIT 1";
                connection=connConstant.connection;
                connection.query(updateQuery, function(err, rows) {
                  	res.redirect('/profile');//we redirect back to the profile
                });
            }
        });


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
