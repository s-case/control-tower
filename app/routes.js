module.exports = function(app, passport) {
	
	var mysql = require('mysql');
	var dbconfig = require('../config/database');
	//var connection = mysql.createConnection(dbconfig.connection);
	//var connection = require('../config/ConnectConstant.js');
	var connection;
	// 

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
	  //console.log('new mysql connection');
	}
	var ownerflag;
	function checkIfOwner(user,proj_name,callback){
		
		handleDisconnect();
		var selectProjects = "SELECT `project_name` FROM " + dbconfig.projects_table +" JOIN " + dbconfig.owners_table + " ON "+ dbconfig.projects_table+
		".`project_id` = "+ dbconfig.owners_table + ".`project_id` "+" WHERE "+ dbconfig.owners_table+".`user_id` = '" + user.id + "'";
		console.log(selectProjects)
		connection.query(selectProjects, function(err, rows){
			console.log(rows);
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

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

	
	// github -------------------------------

		// send to github to do the authentication
		app.get('/auth/github', passport.authenticate('github', { scope : 'email' }));

		// handle the callback after github has authenticated the user
		app.get('/auth/github/callback',
			passport.authenticate('github', {
				successRedirect : '/displayOwnprojects/github',
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
				successRedirect : '/displayOwnprojects/github',
				failureRedirect : '/'
			}));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account
// user account will stay active in case they want to reconnect in the future

	// github -------------------------------
	app.get('/unlink/github', isLoggedIn, function(req, res) {
		var user            = req.user;
		var updateQuery = "UPDATE " + dbconfig.users_table + " SET " +
                                "`github_token` = '" + undefined + "' " +                               
                                "WHERE `github_id` = " + user.github_id + " LIMIT 1";
        handleDisconnect();
		connection.query('USE ' + dbconfig.database);
		connection.query(updateQuery, function(err, rows) {
                                res.redirect('/profile');
                            });
	});
// =============================================================================
// Delete account =============================================================
// =============================================================================
// used to delete accounts. 
	app.get('/delete/github', isLoggedIn, function(req, res) {
		var user = req.user;
		var user_id = req.param('user_id');
		//the query checks if the user owns a project
		var ownerflag;//flag to check if I am owner
		var CheckOwnershipQuery = " SELECT " + dbconfig.projects_table+".`project_name`, "+ dbconfig.owners_table+".`user_id` FROM "+ dbconfig.projects_table +
							" JOIN "+ dbconfig.owners_table+ " ON "+ dbconfig.projects_table + ".`project_id`="+dbconfig.owners_table+".`project_id` " +
								" WHERE " +dbconfig.owners_table+".`user_id`="+"'"+user.id+"'";
		//console.log(CheckOwnQuery);
		handleDisconnect();
		if(!user_id){
			connection.query(CheckOwnershipQuery, function(err, rows) {
	         	if (err) throw err;
	         	var newmessage;//we create the message that contains the projects that the user owns
				for(var i in rows){
					if(i==0){
						newmessage =rows[i].project_name + " and ";
					}
					else {
						newmessage =newmessage+rows[i].project_name + " and ";
					}
				}
				if(newmessage!=null){//we are going to insert this message in the DB, in order to know that the user attempted to delete
					//the profile
					newmessage = newmessage.substring(0,newmessage.length-4);
					handleDisconnect();
					 
					connection.query("SELECT * FROM " + dbconfig.users_table + " WHERE id = '" + user.id + "'", function(err, rows){
		                    if (err)
		                        return done(err);

		                    if (rows.length > 0) {
		                        var userProfile = rows[0];
		                        userProfile.Message=newmessage;
	                            var updateQuery = "UPDATE " + dbconfig.users_table + " SET " +
	                                "`message` = '" + userProfile.Message + "' " +
	                                "WHERE `id` = '" + user.id + "' LIMIT 1";
	                            handleDisconnect();
	                            connection.query(updateQuery, function(err, rows) {
	                            	res.redirect('/profile');
	                            });
		                    }
						
					});
				}	
				if(!rows[0]){
					res.redirect('/delete/github?user_id='+user.id);
				}
			});
		}
		if(user_id){
			
            //delete any project I am the only owner
        	var DeleteProjectsOnlyOwnerQuery = "DELETE FROM " + dbconfig.projects_table + " WHERE " +
        	dbconfig.projects_table + ".project_id IN (SELECT project_id "+
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
                                	res.redirect('/'); 
                            });
                        });
                });
        	});

		}
	});
	// =============================================================================
	// Refresh S-CASE token ACCOUNTS ===============================================
	// =============================================================================
	//we create a new scase token
	var crypto = require('crypto');
	var base64url = require('base64url');

	function scasetokenCreate(size){
	    return base64url(crypto.randomBytes(size));

	}
	//we create the route to refresh the token
	app.get('/refresh/github', isLoggedIn, function(req, res) {
		var user            = req.user;
		handleDisconnect();
		 
		connection.query("SELECT * FROM " + dbconfig.users_table + " WHERE id = '" + user.id + "'", function(err, rows){
            if (rows.length > 0) {
                user = rows[0];
                var scasetoken = scasetokenCreate(35)
                user.scase_token=scasetoken;
                var updateQuery = "UPDATE " + dbconfig.users_table + " SET " +
                        "`scase_token` = '" + user.scase_token + "' " +
                        "WHERE `id` = '" + user.id + "' LIMIT 1";
                handleDisconnect();
				 
                connection.query(updateQuery, function(err, rows) {
                  	res.redirect('/profile');//we redirect back to the profile
                });
            }
        });


	});
	// =============================================================================
	// Display Projects I own, allow to manage and allow to remove =================
	// =============================================================================
	app.get('/displayOwnprojects/github', isLoggedIn, function(req, res) {
		var user            = req.user;
		var proj_name = req.project_name;//if I want
		handleDisconnect();
		 
		//query for the projects I own
		var projectsOwnedQuery = "SELECT `project_name` FROM " + dbconfig.projects_table +" JOIN " + dbconfig.owners_table + " ON "+ dbconfig.projects_table+
			".`project_id` = "+ dbconfig.owners_table + ".`project_id` "+" WHERE "+ dbconfig.owners_table+".`user_id` = '" + user.id + "'";
		connection.query(projectsOwnedQuery, function(err, rows){
            if (rows.length > 0) {
            	res.render('projectsOwn.ejs', {
					projectnames : rows,//I return the project names
					user: user
				});
            }
            else{
                	res.redirect('/profile');
            }

        });
	});
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
		                    	//console.log(rows);
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
	// =============================================================================
	// Delete a Project I own ======================================================
	// delete it from all the other owners and collaborators too
	// =============================================================================
	
	app.get('/deleteprojects/github', isLoggedIn, function(req, res) {
		var user = req.user;
		var proj_name = req.param('project_name');//name of the project to delete
		var proj_id = req.param('project_id');//id of the project
		if(proj_name){
			var ownerflag;
			checkIfOwner(user,proj_name,function(ownerflag){
				if(ownerflag==true){
					var deleteProjectQuery = "DELETE FROM " + dbconfig.projects_table+
						" WHERE " + dbconfig.projects_table + ".project_name=" + "'" + proj_name + "'";
					console.log(deleteProjectQuery);
					handleDisconnect();
					connection.query(deleteProjectQuery, function(err, rows){
		                    res.redirect('/displayOwnprojects/github');
	                });
				}
			});	
		}

	});
	// =============================================================================
	// Display Projects I collaborate ==============================================
	// =============================================================================

	app.get('/displayCollabprojects/github', isLoggedIn, function(req, res) {
		var user = req.user;
		var proj_name = req.project_name;
		handleDisconnect();
		connection.query("SELECT `project_name` FROM " + dbconfig.projects_table +" JOIN " + dbconfig.collaborators_table + " ON "+ dbconfig.projects_table+
			".`project_id` = "+ dbconfig.collaborators_table + ".`project_id` "+" WHERE "+ dbconfig.collaborators_table+".`user_id` = '" + user.id + "'", function(err, rows){
                
                if (rows.length > 0) {//if there are projects I collaborate I show them
                	res.render('projectsCollab.ejs', {
						projectnames : rows,
						user : user
					});
                }
                else{
                	res.redirect('/profile');
                }//otherwise I do not show anything
                
        });

	});
	// =============================================================================
	// Project panel of a Project I collaborate, along with the other owners and collaborators =============================================================
	// =============================================================================

	// github -------------------------------
	app.get('/collabprojects/github', isLoggedIn, function(req, res) {
		var user = req.user;
		var proj_name = req.param('project_name');//name of the project to manage
		if(proj_name){
			var collabflag;
			function checkIfCollab(callback){
				var flag;
				handleDisconnect();
				//check if I collaborate in a project
				connection.query("SELECT `project_name` FROM " + dbconfig.projects_table +" JOIN " + dbconfig.collaborators_table + " ON "+ dbconfig.projects_table+
				".`project_id` = "+ dbconfig.collaborators_table + ".`project_id` "+" WHERE "+ dbconfig.collaborators_table+".`user_id` = '" + user.id + "'", function(err, rows){
					if (rows.length > 0) {
	                    	for(var i in rows){
                    			if(rows[i].project_name==proj_name){
                    				collabflag=true;
                    			}
	                    	}
                    }
                    callback(collabflag);
        		});
			}
			checkIfCollab(function(collabflag){
				if(collabflag==true){
					var owners;//variable to display owners
					var collaborators;//variable to display collaborators
					
					function displayOwners (callback){
						var selectOwnersQuery = "SELECT `github_name` FROM " + dbconfig.users_table +" JOIN " + dbconfig.owners_table + 
						" ON "+ dbconfig.users_table + ".id=" +  dbconfig.owners_table+".user_id "+ "JOIN "+ dbconfig.projects_table+
						" ON "+ dbconfig.projects_table + ".project_id=" + dbconfig.owners_table + ".project_id" + 
						" WHERE " + dbconfig.projects_table + ".project_name=" + "'" + proj_name + "'";
						handleDisconnect();
						connection.query(selectOwnersQuery, function(err, rows){
			                    if (rows.length > 0) {
			                    	console.log(rows);
			                    	owners=rows;
			                    }
			                    callback(owners);
			            });
					}
					
					function displayCollaborators (callback){
		        		var selectCollaboratorsQuery = "SELECT `github_name`," + dbconfig.collaborators_table + ".id AS `collab_id` FROM " + dbconfig.users_table +" JOIN " + dbconfig.collaborators_table + 
						" ON "+ dbconfig.users_table + ".id=" +  dbconfig.collaborators_table+".user_id "+ "JOIN "+ dbconfig.projects_table+
						" ON "+ dbconfig.projects_table + ".project_id=" + dbconfig.collaborators_table + ".project_id" + 
						" WHERE " + dbconfig.projects_table + ".project_name=" + "'" + proj_name + "'";
						handleDisconnect();
						 
		        		connection.query(selectCollaboratorsQuery, function(err, rows){
		                    if (rows.length > 0) {
		                    	console.log(rows);
		                    	collaborators=rows;
		                    }
		                    callback(collaborators);
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
	// =============================================================================
	// Remove a Collaborator from a Project I own or If I want to remove myself ==================================
	// =============================================================================
	app.get('/removeCollab/github', isLoggedIn, function(req, res) {
		var user = req.user;
		var collab_id= req.param('collab_id');//collaborator's id
		var proj_name = req.param('project_name')
		var ownerflag;//flag to check if I am owner
		checkIfOwner(user,proj_name,function(ownerflag){
			if(ownerflag==true){
              var removeCollabQuery = "DELETE FROM " + dbconfig.collaborators_table+
				" WHERE " + dbconfig.collaborators_table + ".id=" + "'" + collab_id + "'";
				handleDisconnect();
				connection.query(removeCollabQuery, function(err, rows){
	                    res.redirect('/manageprojects/github'+'?project_name='+proj_name);
                });
			}
			else{
				var getCollabInfo = "SELECT user_id FROM " + dbconfig.collaborators_table +
					" WHERE " + dbconfig.collaborators_table + ".id=" + "'" + collab_id + "'";
				console.log(getCollabInfo);
				handleDisconnect();
				connection.query(getCollabInfo, function(err, rows){
						if(rows.length>0){
							if(rows[0].user_id==user.id){
								 var removeCollabQuery = "DELETE FROM " + dbconfig.collaborators_table+
									" WHERE " + dbconfig.collaborators_table + ".id=" + "'" + collab_id + "'";
								handleDisconnect();
								connection.query(removeCollabQuery, function(err, rows){
					                    res.redirect('/profile');
				                });
							}
						}
						else{
							res.redirect('/profile');
						}
                });
			}
		});

		
	});
	// =============================================================================
	// Remove an Owner from a Project I own ========================================
	// =============================================================================
	app.get('/removeOwner/github', isLoggedIn, function(req, res) {
		var user = req.user;
		var owner_id= req.param('owner_id');
		var proj_name = req.param('project_name')
		var proj_id = req.param('project_id');
		var ownerflag;//flag to check if I am owner
		checkIfOwner(user,proj_name,function(ownerflag){
			if(ownerflag==true){
				var checkOwnersAmountQuery = "SELECT * FROM " + dbconfig.owners_table + " WHERE "+ dbconfig.owners_table + ".project_id="+"'"+proj_id+"'";
				console.log(checkOwnersAmountQuery);
				handleDisconnect();
				connection.query(checkOwnersAmountQuery, function(err, rows){
						//if there are more than 1 owners, I remove the owner
						if(rows.length>1){
							var removeOwnerQuery = "DELETE FROM " + dbconfig.owners_table+
							" WHERE " + dbconfig.owners_table + ".id=" + "'" + owner_id + "'";
							console.log(removeOwnerQuery);
							handleDisconnect();
							connection.query(removeOwnerQuery, function(err, rows){
								res.redirect('/manageprojects/github'+'?project_name='+proj_name);
							});
						}//if there is only 1 owner, I delete the project
						else{
							res.redirect('/deleteprojects/github'+'?project_name='+proj_name);
						}
	                    
                }); 
                
			}
		});	
		
	});
	// =============================================================================
	// Create a Project I own ========================================
	// =============================================================================
	app.post('/createProject', isLoggedIn, function(req, res) {
		var proj_name = req.body.name;
		console.log('projectname to create'+proj_name);
		var user = req.user;
		console.log(user);
		//var proj_name = req.param('project_name');
		var createProjectQuery = "INSERT INTO " + dbconfig.projects_table +
				" (project_name)" +
				" VALUES ("+ "'" + proj_name+"'"+")";
		console.log(createProjectQuery);
		handleDisconnect();
		connection.query(createProjectQuery, function(err, rows){
			if(rows){
				var getProjectId = "SELECT project_id FROM " + dbconfig.projects_table + " WHERE project_name="+ "'"
							+ proj_name +"'";
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
	// =============================================================================
	// Add an Owner in a Project I own ========================================
	// =============================================================================
	app.post('/addOwner/github', isLoggedIn, function(req, res) {
		var github_name = req.body.name;
		var proj_name = req.body.project_name;
		console.log('projectname to add owner '+proj_name);
		var user = req.user;
		var ownerflag;//flag to check if I am owner
		checkIfOwner(user,proj_name,function(ownerflag){
			if(ownerflag==true){
				var checkIfUserExistsQuery = "SELECT id FROM " + dbconfig.users_table + " WHERE " +
					dbconfig.users_table +".github_name=" + "'" + github_name +"'";
				handleDisconnect();
				connection.query(checkIfUserExistsQuery, function(err,rows){
					if(rows.length>0){
						var user_id = rows[0].id
						var getProjectId = "SELECT project_id FROM " + dbconfig.projects_table + " WHERE project_name="+ "'"
										+ proj_name +"'";
						handleDisconnect();
						connection.query(getProjectId, function(err, rows){
							var createOwnerQuery = "INSERT INTO " +dbconfig.owners_table+ "(user_id,project_id)" +
								" VALUES (" + "'"+ user_id + "'"+ ",'"+rows[0].project_id+"')";
							handleDisconnect();
							console.log(createOwnerQuery);
							connection.query(createOwnerQuery, function(err, rows){
								res.redirect('/manageprojects/github'+'?project_name='+proj_name);
							});
						});
					}
					else{
						res.redirect('/manageprojects/github'+'?project_name='+proj_name);
					}
				});
			}
		});
	});
	// =============================================================================
	// Add an Collaborator in a Project I own ======================================
	// =============================================================================
	app.post('/addCollaborator/github', isLoggedIn, function(req, res) {
		var github_name = req.body.name;
		var proj_name = req.body.project_name;
		console.log('projectname to add owner '+proj_name);
		var user = req.user;
		var ownerflag;//flag to check if I am owner
		checkIfOwner(user,proj_name,function(ownerflag){
			if(ownerflag==true){
				var checkIfUserExistsQuery = "SELECT id FROM " + dbconfig.users_table + " WHERE " +
					dbconfig.users_table +".github_name=" + "'" + github_name +"'";
				handleDisconnect();
				connection.query(checkIfUserExistsQuery, function(err,rows){
					if(rows.length>0){
						var user_id = rows[0].id
						var getProjectId = "SELECT project_id FROM " + dbconfig.projects_table + " WHERE project_name="+ "'"
										+ proj_name +"'";
						handleDisconnect();
						connection.query(getProjectId, function(err, rows){
							var createCollabQuery = "INSERT INTO " +dbconfig.collaborators_table+ "(user_id,project_id)" +
								" VALUES (" + "'"+ user_id + "'"+ ",'"+rows[0].project_id+"')";
							handleDisconnect();
							console.log(createCollabQuery);
							connection.query(createCollabQuery, function(err, rows){
								res.redirect('/manageprojects/github'+'?project_name='+proj_name);
							});
						});
					}
					else{
						res.redirect('/manageprojects/github'+'?project_name='+proj_name);
					}
				});
			}
		});
	});
};



// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();

	res.redirect('/');
}
