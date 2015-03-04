module.exports = function(app, passport) {
	
	var mysql = require('mysql');
	var dbconfig = require('../config/database');
	//var connection = mysql.createConnection(dbconfig.connection);
	//var connection = require('../config/ConnectConstant.js');
	var connection;
	//function to handle the disconnects from the MySQL db
	function handleDisconnect() {
	  connection = mysql.createConnection(dbconfig.connection); // Recreate the connection, since
	                                                  // the old one cannot be reused.
	  connection.connect(function(err) {              // The server is either down
	    if(err) {                                     // or restarting (takes a while sometimes).
	      console.log('error when connecting to db:', err);
	      setTimeout(handleDisconnect, 10000); // We introduce a delay before attempting to reconnect,
	    }                                     // to avoid a hot loop, and to allow our node script to
	  });                                     // process asynchronous requests in the meantime.
	                                          // If you're also serving http, display a 503 error.
	  connection.on('error', function(err) {
	    console.log('db error', err);
	    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
	      handleDisconnect();                         // lost due to either server restart, or a
	    } else {                                      // connnection idle timeout (the wait_timeout
	      throw err;                                  // server variable configures this)
	    }
	  });
	  connection.query('USE ' + dbconfig.database);
	}
	var ownerflag;//flag used to check if the user is an owner
	//function to check if the user is owner of a specific project
	function checkIfOwner(user,proj_name,callback){
		handleDisconnect();
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
		console.log('projectname to create'+proj_name);
		var user = req.user;
		console.log(user);
		//var proj_name = req.param('project_name');
		var createProjectQuery = "INSERT INTO " + dbconfig.projects_table +
				" (project_name)" +
				" VALUES ("+ "'" + proj_name+"'"+")";//query to create the project
		console.log(createProjectQuery);
		handleDisconnect();
		connection.query(createProjectQuery, function(err, rows){
			if(rows){
				var getProjectId = "SELECT project_id FROM " + dbconfig.projects_table + " WHERE project_name="+ "'"
							+ proj_name +"'";//query to get the project's ID to insert in the Owners table as a project the user owns
				handleDisconnect();
				console.log(getProjectId);
				connection.query(getProjectId, function(err, rows){
					if(rows.length>0){
						var createOwnerQuery = "INSERT INTO " +dbconfig.owners_table+ "(user_id,project_id)" +
							" VALUES (" + "'"+ user.id + "'"+ ",'"+rows[0].project_id+"')";
						handleDisconnect();
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
	});
};
// route middleware to ensure user is logged i
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();

	res.redirect('/');
}
