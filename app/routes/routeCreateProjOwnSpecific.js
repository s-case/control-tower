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
	// ===============================================================
	// Create a Project I own ========================================
	// ===============================================================
	app.post('/createProject', isLoggedIn, function(req, res) {
		var proj_name = req.body.name;
		proj_name = proj_name.trim();
		if(proj_name.length>0){
			console.log('projectname to create'+proj_name);
			var user = req.user;
			console.log(user);
			//var proj_name = req.param('project_name');
			var createProjectQuery = "INSERT INTO " + dbconfig.projects_table +
					" (project_name)" +
					" VALUES ("+ "'" + proj_name+"'"+")";//query to create the project
			console.log(createProjectQuery);
			connection=connConstant.connection;
			connection.query(createProjectQuery, function(err, rows){
				if(rows){
					var getProjectId = "SELECT project_id FROM " + dbconfig.projects_table + " WHERE project_name="+ "'"
								+ proj_name +"'";//query to get the project's ID to insert in the Owners table as a project the user owns
					connection=connConstant.connection;
					console.log(getProjectId);
					connection.query(getProjectId, function(err, rows){
						if(rows.length>0){
							var createOwnerQuery = "INSERT INTO " +dbconfig.owners_table+ "(user_id,project_id)" +
								" VALUES (" + "'"+ user.id + "'"+ ",'"+rows[0].project_id+"')";
							connection=connConstant.connection;
							console.log(createOwnerQuery);
							connection.query(createOwnerQuery, function(err, rows){
								res.redirect('/manageprojects/github'+'?project_name='+proj_name);
							});
						}
						else{
							res.redirect('/profile');
						}
					});
				}
				else{
					res.redirect('/profile');
				}
	        }); 
		}
		else{
					res.redirect('/profile');
		}
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
