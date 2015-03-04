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

	// ====================================================================================================================
	// Project panel of a Project I own. Display other owners, collaborators (allow to remove them only if I own a project)
	// ====================================================================================================================

	app.get('/manageprojects/github', isLoggedIn, function(req, res) {
		var user = req.user;
		var proj_name = req.param('project_name');//name of the project to manage
		if(proj_name){
			//flag that is going to be set to true only if own the project
			//function to check if I own the project
			checkIfOwner(user,proj_name,function(ownerflag){
				if(ownerflag==true){
					console.log('i m in');
					var owners;//it is going to include all the owners (names and ids)
					var collaborators;//it is going to include all the collaborators (names and ids)
					function displayOwners (callback){
						//query to select all owners
						var selectOwnersQuery = "SELECT `github_name`,"+dbconfig.projects_table+".`project_id`," + dbconfig.owners_table + ".id AS owner_id FROM "  + dbconfig.users_table +" JOIN " + dbconfig.owners_table + 
						" ON "+ dbconfig.users_table + ".id=" +  dbconfig.owners_table+".user_id "+ "JOIN "+ dbconfig.projects_table+
						" ON "+ dbconfig.projects_table + ".project_id=" + dbconfig.owners_table + ".project_id" + 
						" WHERE " + dbconfig.projects_table + ".project_name=" + "'" + proj_name + "'";
						handleDisconnect();
						connection.query(selectOwnersQuery, function(err, rows){
		                    if (rows.length > 0) {
		                    	owners=rows;
		                    }
		                    callback();
			            });
					}
					function displayCollaborators (callback){
						//query to select all collaborators
		        		var selectCollaboratorsQuery = "SELECT `github_name`," + dbconfig.collaborators_table + ".id AS `collab_id` FROM " + dbconfig.users_table +" JOIN " + dbconfig.collaborators_table + 
						" ON "+ dbconfig.users_table + ".id=" +  dbconfig.collaborators_table+".user_id "+ "JOIN "+ dbconfig.projects_table+
						" ON "+ dbconfig.projects_table + ".project_id=" + dbconfig.collaborators_table + ".project_id" + 
						" WHERE " + dbconfig.projects_table + ".project_name=" + "'" + proj_name + "'";
						handleDisconnect();
		        		connection.query(selectCollaboratorsQuery, function(err, rows){
		                    if (rows.length > 0) {
		                    	//console.log(rows);
		                    	collaborators=rows;
		                    }
		                    callback();//callback at the end of the second query
		        		});
					}
					displayOwners(function(){
						//console.log("owners"+owners);
						//console.log("collabs"+collaborators);
						displayCollaborators(function(){
							res.render('projectSpecific.ejs', {
								ownersnames : owners,//we return owners
								collaboratorsnames : collaborators,//we return collaborators
								projectname : proj_name,//we return project name
								username : user.github_name,//we return the active's User name (it is used in order be able to remove your own account from the project)
								user: user
							});
						});
					});
				}
			});	
		}
	});
};
// route middleware to ensure user is logged i
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();

	res.redirect('/');
}
