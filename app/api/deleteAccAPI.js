var role = "nothing";
module.exports = function(app){
	var mysql = require('mysql');
	var dbconfig = require('../../config/database');
	var connConstant = require('../../config/ConnectConstant');
	var jwt = require('jsonwebtoken');//
	var connection;
	// =============================================================================
	// Delete account API =============================================================
	// =============================================================================
	app.delete('/api/deleteUser',function(req,res){
		var scase_token= req.param('scase_token');//require your scase token in order to authenticate
		var scase_signature = req.param('scase_signature');//require your scase_signature in order to authenticate
		res.setHeader('Content-Type', 'application/json');
		if(scase_token&&scase_signature){
			connection = connConstant.connection;
			//we select the user with the scase_token provided 
			var selectUsersQuery = "SELECT * FROM " + dbconfig.users_table + " WHERE scase_token = '" + scase_token + "'";
			connection.query(selectUsersQuery, function(err, rows){
                if (rows.length > 0) {
                	jwt.verify(scase_signature,rows[0].scase_secret,function(err,decoded){
                		if(err){
							var obj = '{"message": "User with this scase_signature does not exist in S-Case"}';
							var Jobj=JSON.parse(obj);
							res.status(401).send(Jobj);
                		}
                		if(decoded){
                			if(decoded.scasetoken==scase_token){//we check if the produced signature is the same with the one provided
			                	var user_id = rows[0].id;
			                	//delete any project I am the only owner (the only large SQL statement)
					        	var DeleteProjectsOnlyOwnerQuery = "DELETE FROM " + dbconfig.projects_table + 
					        		" WHERE " + dbconfig.projects_table + ".project_id IN (SELECT project_id "+
						        	"FROM (SELECT * FROM " + dbconfig.owners_table + 
						        	" WHERE " +dbconfig.owners_table +".project_id IN (SELECT project_id FROM " +
						        	dbconfig.owners_table + " WHERE "+ dbconfig.owners_table + ".user_id=" + user_id +
						        	")) AS projectsofuser GROUP BY project_id HAVING COUNT(project_id)=1)";
								//console.log(DeleteProjectsOnlyOwnerQuery);
					            connection = connConstant.connection;
					            connection.query(DeleteProjectsOnlyOwnerQuery, function(err, rows) {
					            	if(err){
					                		var obj = '{'+ '"message": "'+ err.code +'"}';
											var Jobj=JSON.parse(obj);
											res.status(500).send(Jobj);
				                	}
				                	else if(rows){
				                		//delete from owners
										var DeleteFromOwnerQuery = "DELETE FROM " + dbconfig.owners_table +                          
							                                " WHERE `user_id` = " + user_id;
						                //console.log(DeleteFromOwnerQuery);
						                connection = connConstant.connection;
						                connection.query(DeleteFromOwnerQuery, function(err, rows) {
						                	if(err){
						                		var obj = '{'+ '"message": "'+ err.code +'"}';
												var Jobj=JSON.parse(obj);
												res.status(500).send(Jobj);
						                	}
						                	else if(rows){
						                		var DeleteFromCollabQuery = "DELETE FROM " + dbconfig.collaborators_table +                          
						                                " WHERE `user_id` = " + user_id;//delete from collaborators
							                    //console.log(DeleteFromCollabQuery);
							                    connection = connConstant.connection;
							                    connection.query(DeleteFromCollabQuery, function(err, rows) {
							                    	var DeleteFromUsersQuery = "DELETE FROM " + dbconfig.users_table +                          
							                			" WHERE `id` = " + user_id;//delete from users table
							            			//console.log(DeleteFromUsersQuery);
							    				  	connection.query(DeleteFromUsersQuery, function(err, rows) {
							                            	if(err){
																var obj = '{'+ '"message": "'+ err.code +'"}';
																var Jobj=JSON.parse(obj);
																res.status(500).send(Jobj);
															}
															else if(rows){
																var obj = '{'+ '"message": "user deleted"}';
																var Jobj=JSON.parse(obj);
																res.status(201).send(Jobj);
															}
							                        });
							                    });
						                	}
						            		
						                });
				                	}
				        		});
							}
		                	else{
								var obj = '{"message": "User with this scase_signature does not exist in S-Case"}';
								var Jobj=JSON.parse(obj);
								res.status(401).send(Jobj);
	                		}
            			}
	            		else{
								var obj = '{"message": "User with this scase_signature does not exist in S-Case"}';
								var Jobj=JSON.parse(obj);
								res.status(401).send(Jobj);
                		}
            		});
	            }
              	else {
					var obj = '{"message": "User with this scase_token does not exist in S-Case"}';
					var Jobj=JSON.parse(obj);
					res.status(401).send(Jobj);
				}
        	});
		}
		else{
			//res.setHeader('Content-Type', 'application/json');
			var obj = '{"message": "you miss some parameters"}';
			var Jobj=JSON.parse(obj);
			res.status(400).send(Jobj);
		}
	});
};