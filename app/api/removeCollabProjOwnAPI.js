var role = "nothing";
module.exports = function(app){
	var mysql = require('mysql');
	var dbconfig = require('../../config/database');
	var connConstant = require('../../config/ConnectConstant');
	var connection;
	var ownerflag=false;//flag used to check if the user is an owner
	var jwt = require('jsonwebtoken');//
	//function to check if the user is owner of a specific project
	function checkIfOwner(user,proj_name,callback){
		connection=connConstant.connection;
		var selectProjects = "SELECT `project_name` FROM " + dbconfig.projects_table +" JOIN " + dbconfig.owners_table + " ON "+ dbconfig.projects_table+
		".`project_id` = "+ dbconfig.owners_table + ".`project_id` "+" WHERE "+ dbconfig.owners_table+".`user_id` = '" + user.id + "'";
		console.log(selectProjects)
		connection.query(selectProjects, function(err, rows){
			if (rows.length > 0) {
				console.log(rows[0]);
            	for(var i in rows){
        			if(rows[i].project_name===proj_name){
        				ownerflag=true;
        			}
            	}
	        }
	        callback(ownerflag);
		});
		
	}
	// =============================================================================
	// Remove a collaborator from a project I own API===============================================
	// =============================================================================
	app.get('/api/removeCollabProjOwn', function(req, res) {
		var scase_token= req.param('scase_token');
		var proj_name= req.param('project_name');
		var github_name = req.param('github_name');
		var google_email = req.param('google_email');//require the goole email of the user you would like to remove from collaborator
		var scase_signature = req.param('scase_signature');//require your scase_signature in order to authenticate
		res.setHeader('Content-Type', 'application/json');
		if(scase_token&&proj_name&&github_name&&scase_signature){
			connection=connConstant.connection;
			//we select the user with the scase_token provided 
			var selectUsersQuery = "SELECT * FROM " + dbconfig.users_table + " WHERE scase_token = '" + scase_token + "'";
			connection.query(selectUsersQuery, function(err, rows){
                if (rows.length > 0) {
                	jwt.verify(scase_signature,rows[0].scase_secret,function(err,decoded){
                		if(err){
							var obj = '{'+ '"User with scase_signature: '+scase_signature + '": "does not exist in S-Case"}';
							var Jobj=JSON.parse(obj);
							res.send(Jobj);
                		}
                		if(decoded){
                			if(decoded.scasetoken=scase_token){//we check if the produced signature is the same with the one provided
			                	var user = rows[0];
			                	connection = connConstant.connection;
			                	var ownerflag;
			                	checkIfOwner(user,proj_name,function(ownerflag){
									if(ownerflag==true){
										var selectCollabQuery = "SELECT * FROM " + dbconfig.users_table + " WHERE github_name = '" + github_name + "'";//query to select the user's details with the provided github name
						              	connection.query(selectCollabQuery, function(err, rows){
						              		if(rows.length>0){
						              			var removeCollabQuery = "DELETE FROM " + dbconfig.collaborators_table+
												" WHERE " + dbconfig.collaborators_table + ".user_id=" + "'" + rows[0].id + "'";//query to remove the collaborator
												connection=connConstant.connection;
												connection.query(removeCollabQuery, function(err, rows){
													var obj = '{'+ '"collaborator '+github_name + '": "deleted"}';
													if(err){
														var obj = '{'+ '"collaborator '+github_name + '": "not deleted"}';
													}
													var Jobj=JSON.parse(obj);
													res.send(Jobj);
							                	});
						              		}
						                	else{
						              			var obj = '{'+ '"User with github_name  '+github_name + '": "does not exist"}';
												var Jobj=JSON.parse(obj);
												res.send(Jobj);
						              		}

						              	});
									}
									else if(ownerflag==false){
										var obj = '{'+ '"User with scase_token  '+scase_token + '": "does not own project ' + proj_name +' or the project does not exist"}';
										var Jobj=JSON.parse(obj);
										res.send(Jobj);
									}
								});
							}
							else{
								var obj = '{'+ '"User with scase_signature: '+scase_signature + '": "does not exist in S-Case"}';
								var Jobj=JSON.parse(obj);
								res.send(Jobj);
		                	}
                		}
                		else{
							var obj = '{'+ '"User with scase_signature: '+scase_signature + '": "does not exist in S-Case"}';
							var Jobj=JSON.parse(obj);
							res.send(Jobj);
                		}
                	});
					
                }
                else {
					var obj = '{'+ '"User with scase_token  '+scase_token + '": "does not exist in S-Case"}';
					var Jobj=JSON.parse(obj);
					res.send(Jobj);
				}
            });
		}
		else if(scase_token&&proj_name&&google_email&&scase_signature){
			connection=connConstant.connection;
			//we select the user with the scase_token provided 
			var selectUsersQuery = "SELECT * FROM " + dbconfig.users_table + " WHERE scase_token = '" + scase_token + "'";
			connection.query(selectUsersQuery, function(err, rows){
                if (rows.length > 0) {
                	jwt.verify(scase_signature,rows[0].scase_secret,function(err,decoded){
                		if(err){
							var obj = '{'+ '"User with scase_signature: '+scase_signature + '": "does not exist in S-Case"}';
							var Jobj=JSON.parse(obj);
							res.send(Jobj);
                		}
                		if(decoded){
                			if(decoded.scasetoken=scase_token){//we check if the produced signature is the same with the one provided
			                	var user = rows[0];
			                	connection = connConstant.connection;
			                	var ownerflag;
			                	checkIfOwner(user,proj_name,function(ownerflag){
			                		console.log(ownerflag);
									if(ownerflag==true){
										var selectCollabQuery = "SELECT * FROM " + dbconfig.users_table + " WHERE google_email = '" + google_email + "'";//query to select the user's details with the provided github name
						              	connection.query(selectCollabQuery, function(err, rows){
						              		if(rows.length>0){
						              			var removeCollabQuery = "DELETE FROM " + dbconfig.collaborators_table+
												" WHERE " + dbconfig.collaborators_table + ".user_id=" + "'" + rows[0].id + "'";//query to remove the collaborator
												connection=connConstant.connection;
												connection.query(removeCollabQuery, function(err, rows){
													var obj = '{'+ '"collaborator '+google_email + '": "deleted"}';
													if(err){
														var obj = '{'+ '"collaborator '+google_email + '": "not deleted"}';
													}
													var Jobj=JSON.parse(obj);
													res.send(Jobj);
							                	});
						              		}
						                	else{
						              			var obj = '{'+ '"User with google email  '+google_email + '": "does not exist"}';
												var Jobj=JSON.parse(obj);
												res.send(Jobj);
						              		}
						              	});
									}
									else if(ownerflag==false){
										var obj = '{'+ '"User with scase_token  '+scase_token + '": "does not own project ' + proj_name +' or the project does not exist"}';
										var Jobj=JSON.parse(obj);
										res.send(Jobj);
									}
								});
							}
							else{
								var obj = '{'+ '"User with scase_signature: '+scase_signature + '": "does not exist in S-Case"}';
								var Jobj=JSON.parse(obj);
								res.send(Jobj);
		                	}
                		}
                		else{
							var obj = '{'+ '"User with scase_signature: '+scase_signature + '": "does not exist in S-Case"}';
							var Jobj=JSON.parse(obj);
							res.send(Jobj);
                		}
                	});
                }
                else {
					var obj = '{'+ '"User with scase_token  '+scase_token + '": "does not exist in S-Case"}';
					var Jobj=JSON.parse(obj);
					res.send(Jobj);
				}
            });
		}
		else{
			var obj = '{'+ '"message": "you miss some parameters"}';
			var Jobj=JSON.parse(obj);
			res.send(Jobj);
		}
	});
};