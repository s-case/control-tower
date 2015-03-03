var role = "nothing";
module.exports = function(app){

var mysql = require('mysql');
var dbconfig = require('../config/database');
var connection;
function handleDisconnect() {
  connection = mysql.createConnection(dbconfig.connection); // Recreate the connection, since the old one cannot be reused.

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
// ROUTES FOR OUR API
// =============================================================================
	// =============================================================================
	// Delete account API =============================================================
	// =============================================================================
	app.get('/api/deleteUser',function(req,res){
		var scase_token=req.param('scase_token');
		if(scase_token){
			handleDisconnect();
			//we select the user with the scase_token provided 
			var selectUsersQuery = "SELECT * FROM " + dbconfig.users_table + " WHERE scase_token = '" + scase_token + "'";
				connection.query(selectUsersQuery, function(err, rows){
				   	if (err)
                        return done(err);
                    if (rows.length > 0) {
                    	var user_id = rows[0].id;
                    	//delete any project I am the only owner (the only large SQL statement)
			        	var DeleteProjectsOnlyOwnerQuery = "DELETE FROM " + dbconfig.projects_table + 
			        		" WHERE " + dbconfig.projects_table + ".project_id IN (SELECT project_id "+
				        	"FROM (SELECT * FROM " + dbconfig.owners_table + 
				        	" WHERE " +dbconfig.owners_table +".project_id IN (SELECT project_id FROM " +
				        	dbconfig.owners_table + " WHERE "+ dbconfig.owners_table + ".user_id=" + user_id +
				        	")) AS projectsofuser GROUP BY project_id HAVING COUNT(project_id)=1)";
						console.log(DeleteProjectsOnlyOwnerQuery);
			            handleDisconnect();
			            connection.query(DeleteProjectsOnlyOwnerQuery, function(err, rows) {
			                //delete from owners
							var DeleteFromOwnerQuery = "DELETE FROM " + dbconfig.owners_table +                          
				                                " WHERE `user_id` = " + user_id;
			                console.log(DeleteFromOwnerQuery);
			                handleDisconnect();
			                connection.query(DeleteFromOwnerQuery, function(err, rows) {
			            		var DeleteFromCollabQuery = "DELETE FROM " + dbconfig.collaborators_table +                          
			                                " WHERE `user_id` = " + user_id;
			                    console.log(DeleteFromCollabQuery);
			                    handleDisconnect();
			                    connection.query(DeleteFromCollabQuery, function(err, rows) {
			                    	var DeleteFromUsersQuery = "DELETE FROM " + dbconfig.users_table +                          
			                			" WHERE `id` = " + user_id;
			            			console.log(DeleteFromUsersQuery);
			    				  	connection.query(DeleteFromUsersQuery, function(err, rows) {
			                            	res.setHeader('Content-Type', 'application/json');
											var obj = '{'
													+ '"userDeleted" : "true"'
													+ '}';
											var Jobj=JSON.parse(obj);
											res.send(Jobj);
			                        });
			                    });
			                });
			        	});
                    }
			});
		}
	});
	// =============================================================================
	// Refresh S-CASE token ACCOUNTS API===============================================
	// =============================================================================
	//we create a new scase token
	var crypto = require('crypto');
	var base64url = require('base64url');
	//function to crete an S-CASE token
	function scasetokenCreate(size){
	    return base64url(crypto.randomBytes(size));
	}
	app.get('/api/refreshSCASEtoken',function(req,res){
		var scase_token=req.param('scase_token');
		if(scase_token){
			handleDisconnect();
			//we select the user with the scase_token provided 
			var selectUsersQuery = "SELECT * FROM " + dbconfig.users_table + " WHERE scase_token = '" + scase_token + "'";
				connection.query(selectUsersQuery, function(err, rows){
				   	if (err)
                        return done(err);
                    if (rows.length > 0) {
                    	var user = rows[0];
                    	handleDisconnect();
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
				                handleDisconnect();
				                connection.query(updateQuery, function(err, rows) {
				                  	res.setHeader('Content-Type', 'application/json');
											var obj = '{'
													+ '"newSCASEtoken" : "'+scasetoken+'"}';
											var Jobj=JSON.parse(obj);
											res.send(Jobj);
				                });
				            }
				        });
                    }
			});
		}
	});
	// =============================================================================
	// Display Projects I own API===============================================
	// =============================================================================
	//we create a new scase token
	var crypto = require('crypto');
	var base64url = require('base64url');
	//function to crete an S-CASE token
	function scasetokenCreate(size){
	    return base64url(crypto.randomBytes(size));
	}
	app.get('/api/displayProjectsOwn',function(req,res){
		var scase_token=req.param('scase_token');
		if(scase_token){
			handleDisconnect();
			//we select the user with the scase_token provided 
			var selectUsersQuery = "SELECT * FROM " + dbconfig.users_table + " WHERE scase_token = '" + scase_token + "'";
				connection.query(selectUsersQuery, function(err, rows){
				   	if (err)
                        return done(err);
                    if (rows.length > 0) {
                    	var user = rows[0];
                    	handleDisconnect();
						//we select the user from the user's table (just to check if the user exists)
						connection.query("SELECT * FROM " + dbconfig.users_table + " WHERE id = '" + user.id + "'", function(err, rows){
				            if (rows.length > 0) {
				                user = rows[0];
				                //query for the projects I own
								var projectsOwnedQuery = "SELECT `project_name` FROM " + dbconfig.projects_table +" JOIN " + dbconfig.owners_table + " ON "+ dbconfig.projects_table+
									".`project_id` = "+ dbconfig.owners_table + ".`project_id` "+" WHERE "+ dbconfig.owners_table+".`user_id` = '" + user.id + "'";
								connection.query(projectsOwnedQuery, function(err, rows){
						            if (rows.length > 0) {
						            	res.setHeader('Content-Type', 'application/json');
											var obj = '{'
													+ '"projectnames" : "'+rows+'"}';
											var Jobj=JSON.parse(obj);
											res.send(Jobj);
									}
					            });
					        }
					    });
		            }
			        
			    });
            }
			
		});
};