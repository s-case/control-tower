var role = "nothing";
module.exports = function(app){
	var mysql = require('mysql');
	var dbconfig = require('../../config/database');
	var connConstant = require('../../config/ConnectConstant');
	var jwt=require('jsonwebtoken');	
	var connection;
	var ownerflag=false;//flag used to check if the user is an owner
	//function to check if the user is owner of a specific project
	function checkIfOwner(user,proj_name,callback){
		connection=connConstant.connection;
		var selectProjects = "SELECT `project_name` FROM " + dbconfig.projects_table +" JOIN " + dbconfig.owners_table + " ON "+ dbconfig.projects_table+
		".`project_id` = "+ dbconfig.owners_table + ".`project_id` "+" WHERE "+ dbconfig.owners_table+".`user_id` = '" + user.id + "'";
		console.log(selectProjects);
		connection.query(selectProjects, function(err, rows){
			if (rows.length > 0) {
            	for(var i in rows){
        			if(rows[i].project_name===proj_name){
        				ownerflag=true;
        			}
            	}
	        }
	        console.log(ownerflag);
	        callback(ownerflag);
		});
	}
	// =============================================================================
	// Add an owner in a project I own API===============================================
	// =============================================================================
	app.put('/api/addOwnerProjOwn', function(req, res) {
		var scase_token= req.param('scase_token');//require your scase token in order to authenticate
		var proj_name= req.param('project_name');//require project name
		var github_name = req.param('github_name');//require the github name of the user you would like to add as an owner
		var google_email = req.param('google_email');//require the goole email of the user you would like to add as an owner
		var scase_signature = req.param('scase_signature');//require your scase_signature in order to authenticate
		res.setHeader('Content-Type', 'application/json');
		if(scase_token&&scase_signature&&proj_name&&github_name){
			connection=connConstant.connection;
			//we select the user with the scase_token provided 
			var selectUsersQuery = "SELECT * FROM " + dbconfig.users_table + " WHERE scase_token = '" + scase_token + "'";
			connection.query(selectUsersQuery, function(err, rows){
                if (rows.length > 0) {
                	jwt.verify(scase_signature,rows[0].scase_secret,function(err,decoded){
                		if(err){
							var obj = '{"message": "User with scase_signature '+scase_signature + 'does not exist in S-Case"}';
							var Jobj=JSON.parse(obj);
							res.status(404).send(Jobj);
                		}
                		if(decoded){
                			if(decoded.scasetoken=scase_token){//we check if the produced signature is the same with the one provided
			                	var user = rows[0];
			                	connection = connConstant.connection;
			                	ownerflag=false;
			                	checkIfOwner(user,proj_name,function(ownerflag){//check if the user is owner of the project
									if(ownerflag==true){
										var checkIfUserExistsQuery = "SELECT id FROM " + dbconfig.users_table + " WHERE " +
											dbconfig.users_table +".github_name=" + "'" + github_name +"'";//check if the user to be added as an owner exists
										connection=connConstant.connection;
										connection.query(checkIfUserExistsQuery, function(err,rows){
											if(rows.length>0){
												var user_id = rows[0].id
												var getProjectId = "SELECT project_id FROM " + dbconfig.projects_table + " WHERE project_name="+ "'"
																+ proj_name +"'";//if the user exists, get the project's id
												connection=connConstant.connection;
												connection.query(getProjectId, function(err, rows){
													var createOwnerQuery = "INSERT INTO " +dbconfig.owners_table+ "(user_id,project_id)" +
														" VALUES (" + "'"+ user_id + "'"+ ",'"+rows[0].project_id+"')";//then insert the user as an owner in the owner's table
													connection=connConstant.connection;
													//console.log(createOwnerQuery);
													connection.query(createOwnerQuery, function(err, rows){
														if(err){
																var obj = '{'+ '"message": "'+ err.code +'"}';
																var Jobj=JSON.parse(obj);
																res.status(500).send(Jobj);
														}
														else if(rows){
															var obj = '{'+ '"message": "owner '+github_name + ' added"}';
															var Jobj=JSON.parse(obj);
															res.status(201).send(Jobj);
														}
													});
												});
											}
											else if (err) {
												var obj = '{'+ '"message": "'+ err.code +'"}';
												var Jobj=JSON.parse(obj);
												res.status(500).send(Jobj);
											}
											else{
												//res.setHeader('Content-Type', 'application/json');
												var obj = '{'+ '"message": "user '+github_name + ' does not exist in S-Case"}';
												var Jobj=JSON.parse(obj);
												res.status(404).send(Jobj);
											}
										});
									}
									else if(ownerflag==false){
										//res.setHeader('Content-Type', 'application/json');
										var obj = '{'+ '"message" : "User with scase_token '+scase_token + ' does not own project ' + proj_name +' or project does not exist"}';
										var Jobj=JSON.parse(obj);
										res.status(401).send(Jobj);
									}
									
								});
							}
							else{
								var obj = '{"message": "User with scase_signature '+scase_signature + 'does not exist in S-Case"}';
								var Jobj=JSON.parse(obj);
								res.status(404).send(Jobj);
	                		}
                		}
                		else{
								var obj = '{"message": "User with scase_signature '+scase_signature + 'does not exist in S-Case"}';
								var Jobj=JSON.parse(obj);
								res.status(404).send(Jobj);
                		}
                	});
                }
                else {
					var obj = '{'+ '"message": "User with scase_token '+scase_token + ' does not exist in S-Case"}';
					var Jobj=JSON.parse(obj);
					res.status(404).send(Jobj);
				}
            });
		}
		else if(scase_token&&scase_signature&&proj_name&&google_email){
			connection=connConstant.connection;
			//we select the user with the scase_token provided 
			var selectUsersQuery = "SELECT * FROM " + dbconfig.users_table + " WHERE scase_token = '" + scase_token + "'";
			connection.query(selectUsersQuery, function(err, rows){
                if (rows.length > 0) {
                	jwt.verify(scase_signature,rows[0].scase_secret,function(err,decoded){
                		if(err){
								var obj = '{"message": "User with scase_signature '+scase_signature + 'does not exist in S-Case"}';
								var Jobj=JSON.parse(obj);
								res.status(404).send(Jobj);
                		}
                		if(decoded){
                			if(decoded.scasetoken=scase_token){//we check if the produced signature is the same with the one provided
			                	var user = rows[0];
			                	connection = connConstant.connection;
			                	var ownerflag;
			                	checkIfOwner(user,proj_name,function(ownerflag){//check if the user is owner of the project
									if(ownerflag==true){
										var checkIfUserExistsQuery = "SELECT id FROM " + dbconfig.users_table + " WHERE " +
											dbconfig.users_table +".google_email=" + "'" + google_email +"'";//check if the user to be added as an owner exists
										connection=connConstant.connection;
										connection.query(checkIfUserExistsQuery, function(err,rows){
											if(rows.length>0){
												var user_id = rows[0].id
												var getProjectId = "SELECT project_id FROM " + dbconfig.projects_table + " WHERE project_name="+ "'"
																+ proj_name +"'";//if the user exists, get the project's id
												connection=connConstant.connection;
												connection.query(getProjectId, function(err, rows){
													if(rows.length>0){
														var createOwnerQuery = "INSERT INTO " +dbconfig.owners_table+ "(user_id,project_id)" +
															" VALUES (" + "'"+ user_id + "'"+ ",'"+rows[0].project_id+"')";//then insert the user as an owner in the owner's table
														connection=connConstant.connection;
														//console.log(createOwnerQuery);
														connection.query(createOwnerQuery, function(err, rows){
															if(err){
																var obj = '{'+ '"message": "'+ err.code +'"}';
																var Jobj=JSON.parse(obj);
																res.status(500).send(Jobj);
															}
															else if(rows){
																var obj = '{'+ '"message" : "owner '+google_email + ' added"}';
																var Jobj=JSON.parse(obj);
																res.status(201).send(Jobj);
															}
														});
													}
												});
											}
											else if (err) {
												var obj = '{'+ '"message": "'+ err.code +'"}';
												var Jobj=JSON.parse(obj);
												res.status(500).send(Jobj);
											}
											else{
												//res.setHeader('Content-Type', 'application/json');
												var obj = '{'+ '"message": "user '+github_name + ' does not exist in S-Case"}';
												var Jobj=JSON.parse(obj);
												res.status(404).send(Jobj);
											}
										});
									}
									else if(ownerflag==false){
										//res.setHeader('Content-Type', 'application/json');
										var obj = '{'+ '"message" : "User with scase_token '+scase_token + ' does not own project ' + proj_name +' or project does not exist"}';
										var Jobj=JSON.parse(obj);
										res.status(401).send(Jobj);
									}
								});
							}
							else{
								var obj = '{"message": "User with scase_signature '+scase_signature + ' does not exist in S-Case"}';
								var Jobj=JSON.parse(obj);
								res.status(404).send(Jobj);
	                		}
                		}
                		else{
								var obj = '{"message": "User with scase_signature '+scase_signature + ' does not exist in S-Case"}';
								var Jobj=JSON.parse(obj);
								res.status(404).send(Jobj);
                		}

                	});
					
                }
                else {
					var obj = '{'+ '"message": "User with scase_token '+scase_token + ' does not exist in S-Case"}';
					var Jobj=JSON.parse(obj);
					res.status(404).send(Jobj);
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