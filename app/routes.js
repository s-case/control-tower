module.exports = function(app, passport) {
	
	var mysql = require('mysql');
	var dbconfig = require('../config/database');
	//var connection = mysql.createConnection(dbconfig.connection);
	var connection = require('../config/ConnectConstant.js');
	connection.query('USE ' + dbconfig.database);

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
		
	  //console.log('new mysql connection');
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
				successRedirect : '/profile',
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
				successRedirect : '/profile',
				failureRedirect : '/'
			}));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

	// github -------------------------------
	app.get('/unlink/github', isLoggedIn, function(req, res) {

		
		var user            = req.user;
		var updateQuery = "UPDATE " + dbconfig.users_table + " SET " +
                                "`github_token` = '" + undefined + "' " +                               
                                "WHERE `github_id` = " + user.github_id + " LIMIT 1";
        var connection = require('../config/ConnectConstant.js');
		connection.query('USE ' + dbconfig.database);
		connection.query(updateQuery, function(err, rows) {
                                res.redirect('/profile');
                            });
	});
// =============================================================================
// Delete account =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future
	// github -------------------------------
	app.get('/delete/github', isLoggedIn, function(req, res) {

		
		var user            = req.user;

		var CheckOwnQuery = " SELECT " + dbconfig.projects_table+".`project_name`, "+ dbconfig.owners_table+".`user_id` FROM "+ dbconfig.projects_table +
							" JOIN "+ dbconfig.owners_table+ " ON "+ dbconfig.projects_table + ".`project_id`="+dbconfig.owners_table+".`project_id` " +
								" WHERE " +dbconfig.owners_table+".`user_id`="+"'"+user.id+"'";
		console.log(CheckOwnQuery);
		var connection = require('../config/ConnectConstant.js');
		connection.query('USE ' + dbconfig.database);
		connection.query(CheckOwnQuery, function(err, rows) {
                         	if (err) throw err;
                         	var newmessage;
							for(var i in rows){
								if(i==0){
									newmessage =rows[i].project_name + " and ";
								}
								else {
									newmessage =newmessage+rows[i].project_name + " and ";
								}
							}
							if(newmessage!=null){
								newmessage = newmessage.substring(0,newmessage.length-4);
								var connection = require('../config/ConnectConstant.js');
								connection.query('USE ' + dbconfig.database);
								connection.query("SELECT * FROM " + dbconfig.users_table + " WHERE id = '" + user.id + "'", function(err, rows){
					                    if (err)
					                        return done(err);

					                    if (rows.length > 0) {

					                        var userProfile = rows[0];
					                        userProfile.Message=newmessage;
				                            var updateQuery = "UPDATE " + dbconfig.users_table + " SET " +
				                                "`message` = '" + userProfile.Message + "' " +
				                                "WHERE `id` = '" + user.id + "' LIMIT 1";
			                                var connection = require('../config/ConnectConstant.js');
											connection.query('USE ' + dbconfig.database);
				                            connection.query(updateQuery, function(err, rows) {
				                              
				                            });
					                    }
									
								});
							}	
							if(!rows[0]){

								var DeleteQuery = "DELETE FROM" + dbconfig.users_table + " SET " +
						                                "`github_token` = '" + undefined + "' " +                               
						                                "WHERE `github_id` = " + user.github_id + " LIMIT 1";
                                var connection = require('../config/ConnectConstant.js');
								connection.query('USE ' + dbconfig.database);
								connection.query(DeleteQuery, function(err, rows) {
						                                
						                            });
							}
							if(newmessage!=null){
								res.redirect('/profile_alert');
							}else{
								res.redirect('/');
							}


						});
	});
	// =============================================================================
	// Refresh S-CASE token ACCOUNTS =============================================================
	// =============================================================================
	// used to unlink accounts. for social accounts, just remove the token
	// for local account, remove email and password
	// user account will stay active in case they want to reconnect in the future
		var crypto = require('crypto');
		var base64url = require('base64url');

		function scasetokenCreate(size){
		    return base64url(crypto.randomBytes(size));

		}

		// github -------------------------------
		app.get('/refresh/github', isLoggedIn, function(req, res) {
			var user            = req.user;
			var connection = require('../config/ConnectConstant.js');
			connection.query('USE ' + dbconfig.database);
			connection.query("SELECT * FROM " + dbconfig.users_table + " WHERE id = '" + user.id + "'", function(err, rows){
						
	                    if (rows.length > 0) {
	                        user = rows[0];
	                        var scasetoken = scasetokenCreate(35)
	                        user.scase_token=scasetoken;
	                        var updateQuery = "UPDATE " + dbconfig.users_table + " SET " +
	                                "`scase_token` = '" + user.scase_token + "' " +
	                                "WHERE `id` = '" + user.id + "' LIMIT 1";
                            var connection = require('../config/ConnectConstant.js');
							connection.query('USE ' + dbconfig.database);
	                        connection.query(updateQuery, function(err, rows) {
	                          
	                        });
	                        
	                    }
	                    res.redirect('/profile');
	        });


		});
		// =============================================================================
		// Display Projects I own, allow to manage and allow to remove =============================================================
		// =============================================================================

		// github -------------------------------
		app.get('/displayOwnprojects/github', isLoggedIn, function(req, res) {
			var user            = req.user;
			var proj_name = req.project_name;//if I want
			handleDisconnect();
			connection.query('USE ' + dbconfig.database);
			connection.query("SELECT `project_name` FROM " + dbconfig.projects_table +" JOIN " + dbconfig.owners_table + " ON "+ dbconfig.projects_table+
				".`project_id` = "+ dbconfig.owners_table + ".`project_id` "+" WHERE "+ dbconfig.owners_table+".`user_id` = '" + user.id + "'", function(err, rows){
						
	                    if (rows.length > 0) {
	                    	console.log(rows);
	                    	res.render('projectsOwn.ejs', {
								projectnames : rows
							});
	                    }
	        });

		});
		// =============================================================================
		// Project panel of a Project I own, along with the other owners and collaborators to remove =============================================================
		// =============================================================================

		// github -------------------------------
		app.get('/manageprojects/github', isLoggedIn, function(req, res) {
			var user = req.user;
			var proj_name = req.param('project_name');//name of the project to manage
			if(proj_name){
				var ownerflag;
				function checkIfOwner(callback){
					var flag;
					handleDisconnect();
					connection.query('USE ' + dbconfig.database);
					connection.query("SELECT `project_name` FROM " + dbconfig.projects_table +" JOIN " + dbconfig.owners_table + " ON "+ dbconfig.projects_table+
					".`project_id` = "+ dbconfig.owners_table + ".`project_id` "+" WHERE "+ dbconfig.owners_table+".`user_id` = '" + user.id + "'", function(err, rows){
						if (rows.length > 0) {
		                    	for(var i in rows){
	                    			if(rows[i].project_name==proj_name){
	                    				ownerflag=true;
	                    			}
		                    	}
	                    }
	                    callback();
	        		});
				}
				checkIfOwner(function(){
					if(ownerflag){
						var owners;
						var collaborators;
						function displayOwnersCollaborators (callback){

							var selectOwnersQuery = "SELECT `github_name`,"+dbconfig.projects_table+".`project_id`," + dbconfig.owners_table + ".id AS owner_id FROM "  + dbconfig.users_table +" JOIN " + dbconfig.owners_table + 
							" ON "+ dbconfig.users_table + ".id=" +  dbconfig.owners_table+".user_id "+ "JOIN "+ dbconfig.projects_table+
							" ON "+ dbconfig.projects_table + ".project_id=" + dbconfig.owners_table + ".project_id" + 
							" WHERE " + dbconfig.projects_table + ".project_name=" + "'" + proj_name + "'";
							handleDisconnect();
							connection.query('USE ' + dbconfig.database);
							connection.query(selectOwnersQuery, function(err, rows){
				                    if (rows.length > 0) {
				                    	console.log(rows);
				                    	owners=rows;
				                    }
				                }
			        		);
			        		var selectCollaboratorsQuery = "SELECT `github_name`," + dbconfig.collaborators_table + ".id AS `collab_id` FROM " + dbconfig.users_table +" JOIN " + dbconfig.collaborators_table + 
							" ON "+ dbconfig.users_table + ".id=" +  dbconfig.collaborators_table+".user_id "+ "JOIN "+ dbconfig.projects_table+
							" ON "+ dbconfig.projects_table + ".project_id=" + dbconfig.collaborators_table + ".project_id" + 
							" WHERE " + dbconfig.projects_table + ".project_name=" + "'" + proj_name + "'";
							handleDisconnect();
							connection.query('USE ' + dbconfig.database);
			        		connection.query(selectCollaboratorsQuery, function(err, rows){
			                    if (rows.length > 0) {
			                    	console.log(rows);
			                    	collaborators=rows;
			                    }
			                    callback();
			        		});
						}
						displayOwnersCollaborators(function(){
							console.log("owners"+owners);
							console.log("collabs"+collaborators);
							res.render('projectSpecific.ejs', {
										ownersnames : owners,
										collaboratorsnames : collaborators,
										projectname : proj_name,
										username : user.github_name
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
		
		// github -------------------------------
		app.get('/deleteprojects/github', isLoggedIn, function(req, res) {
			var user = req.user;
			var proj_name = req.param('project_name');//name of the project to delete
			var proj_id = req.param('project_id');
			if(proj_name){
				var ownerflag;
				function deleteIfOwner(callback){
					var flag;
					handleDisconnect();
					connection.query('USE ' + dbconfig.database);
					var selectQuery = "SELECT `project_name` FROM " + dbconfig.projects_table +" JOIN " + dbconfig.owners_table + " ON "+ dbconfig.projects_table+
					".`project_id` = "+ dbconfig.owners_table + ".`project_id` "+" WHERE "+ dbconfig.owners_table+".`user_id` = '" + user.id + "'";
					console.log(selectQuery);
					connection.query(selectQuery, function(err, rows){
						if (rows.length > 0) {
		                    	for(var i in rows){
	                    			if(rows[i].project_name==proj_name){
	                    				ownerflag=true;
	                    			}
		                    	}
	                    }
	                    callback();
	        		});
				}
				deleteIfOwner(function(){
					if(ownerflag==true){
						var deleteProjectQuery = "DELETE FROM " + dbconfig.projects_table+
							" WHERE " + dbconfig.projects_table + ".project_name=" + "'" + proj_name + "'";
							handleDisconnect();
							connection.query('USE ' + dbconfig.database);
							connection.query(deleteProjectQuery, function(err, rows){
				                    res.redirect('/displayOwnprojects/github');
			                });
					}
				});	
			}

		});
		// =============================================================================
		// Display Projects I collaborate =============================================================
		// =============================================================================

		// github -------------------------------
		app.get('/displayCollabprojects/github', isLoggedIn, function(req, res) {
			var user            = req.user;
			var proj_name = req.project_name;//if I want
			handleDisconnect();
			connection.query('USE ' + dbconfig.database);
			connection.query("SELECT `project_name` FROM " + dbconfig.projects_table +" JOIN " + dbconfig.collaborators_table + " ON "+ dbconfig.projects_table+
				".`project_id` = "+ dbconfig.collaborators_table + ".`project_id` "+" WHERE "+ dbconfig.collaborators_table+".`user_id` = '" + user.id + "'", function(err, rows){
						
	                    if (rows.length > 0) {
	                    	console.log(rows);
	                    	res.render('projectsCollab.ejs', {
								projectnames : rows
							});
	                    }
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
					connection.query('USE ' + dbconfig.database);
					connection.query("SELECT `project_name` FROM " + dbconfig.projects_table +" JOIN " + dbconfig.collaborators_table + " ON "+ dbconfig.projects_table+
					".`project_id` = "+ dbconfig.collaborators_table + ".`project_id` "+" WHERE "+ dbconfig.collaborators_table+".`user_id` = '" + user.id + "'", function(err, rows){
						if (rows.length > 0) {
		                    	for(var i in rows){
	                    			if(rows[i].project_name==proj_name){
	                    				collabflag=true;
	                    			}
		                    	}
	                    }
	                    callback();
	        		});
				}
				checkIfCollab(function(){
					if(collabflag==true){
						var owners;
						var collaborators;
						function displayOwnersCollaborators (callback){
							var selectOwnersQuery = "SELECT `github_name` FROM " + dbconfig.users_table +" JOIN " + dbconfig.owners_table + 
							" ON "+ dbconfig.users_table + ".id=" +  dbconfig.owners_table+".user_id "+ "JOIN "+ dbconfig.projects_table+
							" ON "+ dbconfig.projects_table + ".project_id=" + dbconfig.owners_table + ".project_id" + 
							" WHERE " + dbconfig.projects_table + ".project_name=" + "'" + proj_name + "'";
							handleDisconnect();
							connection.query('USE ' + dbconfig.database);
							connection.query(selectOwnersQuery, function(err, rows){
				                    if (rows.length > 0) {
				                    	console.log(rows);
				                    	owners=rows;
				                    }
				                }
			        		);
			        		var selectCollaboratorsQuery = "SELECT `github_name`," + dbconfig.collaborators_table + ".id AS `collab_id` FROM " + dbconfig.users_table +" JOIN " + dbconfig.collaborators_table + 
							" ON "+ dbconfig.users_table + ".id=" +  dbconfig.collaborators_table+".user_id "+ "JOIN "+ dbconfig.projects_table+
							" ON "+ dbconfig.projects_table + ".project_id=" + dbconfig.collaborators_table + ".project_id" + 
							" WHERE " + dbconfig.projects_table + ".project_name=" + "'" + proj_name + "'";
							handleDisconnect();
							connection.query('USE ' + dbconfig.database);
			        		connection.query(selectCollaboratorsQuery, function(err, rows){
			                    if (rows.length > 0) {
			                    	console.log(rows);
			                    	collaborators=rows;
			                    }
			                    callback();
			        		});
						}
						displayOwnersCollaborators(function(){
							console.log("owners"+owners);
							console.log("collabs"+collaborators);
							res.render('projectSpecific.ejs', {
										ownersnames : owners,
										collaboratorsnames : collaborators,
										projectname : proj_name,
										username : user.github_name
									});

						});
					}
				});	
			}
		});

		// =============================================================================
		// Remove a Collaborator from a Project I own ======================================================
		// 
		// =============================================================================

		// github -------------------------------
		app.get('/removeCollab/github', isLoggedIn, function(req, res) {
			var user = req.user;
			var collab_id= req.param('collab_id');
			var ownerflag;
			var proj_name = req.param('project_name')
			function removeIfOwner(callback){
				var flag;
				handleDisconnect();
				connection.query('USE ' + dbconfig.database);
				connection.query("SELECT `project_name` FROM " + dbconfig.projects_table +" JOIN " + dbconfig.owners_table + " ON "+ dbconfig.projects_table+
				".`project_id` = "+ dbconfig.owners_table + ".`project_id` "+" WHERE "+ dbconfig.owners_table+".`user_id` = '" + user.id + "'", function(err, rows){
					if (rows.length > 0) {
	                    	for(var i in rows){
                    			if(rows[i].project_name==proj_name){
                    				ownerflag=true;
                    			}
	                    	}
                    }
                    callback();
        		});
			}
			removeIfOwner(function(){
				if(ownerflag==true){
	              var removeCollabQuery = "DELETE FROM " + dbconfig.collaborators_table+
					" WHERE " + dbconfig.collaborators_table + ".id=" + "'" + collab_id + "'";
					handleDisconnect();
					connection.query('USE ' + dbconfig.database);
					connection.query(removeCollabQuery, function(err, rows){
		                    res.redirect('/manageprojects/github'+'?project_name='+proj_name);
	                });      
	                
				}
			});	
			
		});
		// =============================================================================
		// Remove an Owner from a Project I own ======================================================
		// 
		// =============================================================================
		
		

		// github -------------------------------
		app.get('/removeOwner/github', isLoggedIn, function(req, res) {
			var user = req.user;
			var owner_id= req.param('owner_id');
			var ownerflag;
			var proj_name = req.param('project_name')
			var proj_id = req.param('project_id');
			function removeIfOwner(callback){
				var flag;
				handleDisconnect();
				connection.query('USE ' + dbconfig.database);
				connection.query("SELECT `project_name` FROM " + dbconfig.projects_table +" JOIN " + dbconfig.owners_table + " ON "+ dbconfig.projects_table+
				".`project_id` = "+ dbconfig.owners_table + ".`project_id` "+" WHERE "+ dbconfig.owners_table+".`user_id` = '" + user.id + "'", function(err, rows){
					if (rows.length > 0) {
	                    	for(var i in rows){
                    			if(rows[i].project_name==proj_name){
                    				ownerflag=true;
                    			}
	                    	}
                    }
                    callback();
        		});
			}
			removeIfOwner(function(){
				if(ownerflag==true){
					var checkOwnersAmountQuery = "SELECT * FROM " + dbconfig.owners_table + " WHERE "+ dbconfig.owners_table + ".project_id="+"'"+proj_id+"'";
					console.log(checkOwnersAmountQuery);
					handleDisconnect();
					connection.query('USE ' + dbconfig.database);
					connection.query(checkOwnersAmountQuery, function(err, rows){
							if(rows.length>1){
								var removeOwnerQuery = "DELETE FROM " + dbconfig.owners_table+
								" WHERE " + dbconfig.owners_table + ".id=" + "'" + owner_id + "'";
								console.log(removeOwnerQuery);
								handleDisconnect();
								connection.query(removeOwnerQuery, function(err, rows){
									res.redirect('/manageprojects/github'+'?project_name='+proj_name);
								});
							}
							if(rows.length>0){
								res.redirect('/deleteprojects/github'+'?project_name='+proj_name);
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
