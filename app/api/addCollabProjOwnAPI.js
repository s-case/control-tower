var role = "nothing";
module.exports = function(app){
	var mysql = require('mysql');//it loads the mysql package
	var dbconfig = require('../../config/database');//it loads the configuration of the database
	var connConstant = require('../../config/ConnectConstant');//it loads a module that ensure continuous connection to the database
	var connection;//variable used for the connection to the database
	var ownerflag=false;//flag used to check if the user is an owner
	var jwt = require('jsonwebtoken');//
	//============function to check if the user is owner of a specific project============
	function checkIfOwner(user,proj_name,callback){
		connection=connConstant.connection;
		//query to select all the projects a user owns
		var selectProjects = "SELECT `project_name` FROM " + dbconfig.projects_table +" JOIN " + dbconfig.owners_table + " ON "+ dbconfig.projects_table+
		".`project_id` = "+ dbconfig.owners_table + ".`project_id` "+" WHERE "+ dbconfig.owners_table+".`user_id` = '" + user.id + "'";
		//console.log(selectProjects)
		connection.query(selectProjects, function(err, rows){
			if (rows.length > 0) {
            	for(var i in rows){
        			if(rows[i].project_name===proj_name){
        				ownerflag=true;//if the user owns the project, the flag is set to true
        			}
            	}
	        }
	        callback(ownerflag);
		});
	}
	// =============================================================================
	// Add an collaborator in a project I own API===================================
	// =============================================================================
	app.put('/api/addCollabProjOwn', function(req, res) {
		res.setHeader('Content-Type', 'application/json');
		var scase_token= req.param('scase_token');//require your scase token in order to authenticate
		var scase_signature = req.param('scase_signature');//require your scase_signature in order to authenticate
		var proj_name= req.param('project_name');//require project name
		var github_name = req.param('github_name');//require the github name of the user you would like to add as a collaborator
		var google_email = req.param('google_email');//require the goole email of the user you would like to add as a collaborator
		if(scase_token&&proj_name&&github_name&&scase_signature&&(!google_email)){
			connection=connConstant.connection;//ensure that there is a connection to the DB
			//we select the user with the scase_token provided 
			var selectUsersQuery = "SELECT * FROM " + dbconfig.users_table + " WHERE scase_token = '" + scase_token + "'";//query to get all the info of the user with the provided scase token
			connection.query(selectUsersQuery, function(err, rows){
                if (rows.length > 0) {
                	jwt.verify(scase_signature,rows[0].scase_secret,function(err,decoded){
                		if(err){
							var obj = '{"message": "User with this scase_signature does not exist in S-Case"}';
							var Jobj=JSON.parse(obj);
							res.status(404).send(Jobj);
                		}
                		if(decoded){
							if(decoded.scasetoken==scase_token){//we check if the produced signature is the same with the one provided
		                		var user = rows[0];
		                		connection = connConstant.connection;
		                		ownerflag=false;
			                	checkIfOwner(user,proj_name,function(ownerflag){//we gonna check if the user is owner of the project
			                		//console.log(ownerflag);
									if(ownerflag==true){//if the user owns the project we proceed
										var checkIfUserExistsQuery = "SELECT id FROM " + dbconfig.users_table + " WHERE " +
											dbconfig.users_table +".github_name=" + "'" + github_name +"'";
										//we are goint to check if the user that we are asked to add as a collaborator exists
										connection=connConstant.connection;
										connection.query(checkIfUserExistsQuery, function(err,rows){
											if(rows.length>0){
												var user_id = rows[0].id
												//if the user exists, we get the project's id for the provided project name
												var getProjectId = "SELECT project_id FROM " + dbconfig.projects_table + " WHERE project_name="+ "'"
																+ proj_name +"'";
												connection=connConstant.connection;
												connection.query(getProjectId, function(err, rows){
													if(rows.length>0){//clause if the project exists
														//query to insert a collaborator
														var createCollabQuery = "INSERT INTO " +dbconfig.collaborators_table+ "(user_id,project_id)" +
															" VALUES (" + "'"+ user_id + "'"+ ",'"+rows[0].project_id+"')";//insert the user as an owner in the owner's table
														connection=connConstant.connection;
														connection.query(createCollabQuery, function(err, rows){
															if(err){
																var obj = '{'+ '"message": "'+ err.code +'"}';
																var Jobj=JSON.parse(obj);
																res.status(500).send(Jobj);
															}
															else if(rows){
																var obj = '{'+ '"message": "collaborator '+github_name + ' added"}';
																var Jobj=JSON.parse(obj);
																res.status(201).send(Jobj);
															}
														});
													}
													else{//the project does not exist we return a message
														var obj = '{'+ '"message": "project' + proj_name +' does not exist"}';
														var Jobj=JSON.parse(obj);
														res.status(500).send(Jobj);
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
										var obj = '{'+ '"message" : "User with this scase_token does not own project ' + proj_name +' or project does not exist"}';
										var Jobj=JSON.parse(obj);
										res.status(401).send(Jobj);
									}
								});
		                	}
		                	else{
								var obj = '{"message": "User with this scase_signature does not exist in S-Case"}';
								var Jobj=JSON.parse(obj);
								res.status(404).send(Jobj);
	                		}
	                	}
	                	else{
								var obj = '{"message": "User with this scase_signature does not exist in S-Case"}';
								var Jobj=JSON.parse(obj);
								res.status(404).send(Jobj);
                		}
                	});
                }
                else {
					var obj = '{"message": "User with this scase_token does not exist in S-Case"}';
					var Jobj=JSON.parse(obj);
					res.status(404).send(Jobj);
				}
            });
		}
		else if(scase_token&&proj_name&&google_email&&(!github_name)&&scase_signature){
			connection=connConstant.connection;//ensure that there is a connection to the DB
			//we select the user with the scase_token provided 
			var selectUsersQuery = "SELECT * FROM " + dbconfig.users_table + " WHERE scase_token = '" + scase_token + "'";//query to get all the info of the user with the provided scase token
			connection.query(selectUsersQuery, function(err, rows){
                if (rows.length > 0) {
                	jwt.verify(scase_signature,rows[0].scase_secret,function(err,decoded){
                		if(err){
								var obj = '{"message": "User with this scase_signature does not exist in S-Case"}';
								var Jobj=JSON.parse(obj);
								res.status(404).send(Jobj);
                		}
                		if(decoded){
							if(decoded.scasetoken==scase_token){//we check if the produced signature is the same with the one provided
		                		var user = rows[0];
		                		connection = connConstant.connection;
		                		var ownerflag;
			                	checkIfOwner(user,proj_name,function(ownerflag){//we gonna check if the user is owner of the project
			                		//console.log(ownerflag);
									if(ownerflag==true){//if the user owns the project we proceed
										var checkIfUserExistsQuery = "SELECT id FROM " + dbconfig.users_table + " WHERE " +
											dbconfig.users_table +".google_email=" + "'" + google_email +"'";
										//we are goint to check if the user that we are asked to add as a collaborator exists
										connection=connConstant.connection;
										connection.query(checkIfUserExistsQuery, function(err,rows){
											if(rows.length>0){
												var user_id = rows[0].id
												//if the user exists, we get the project's id for the provided project name
												var getProjectId = "SELECT project_id FROM " + dbconfig.projects_table + " WHERE project_name="+ "'"
																+ proj_name +"'";
												connection=connConstant.connection;
												connection.query(getProjectId, function(err, rows){
													if(rows.length>0){//clause if the project exists
														//query to insert a collaborator
														var createCollabQuery = "INSERT INTO " +dbconfig.collaborators_table+ "(user_id,project_id)" +
															" VALUES (" + "'"+ user_id + "'"+ ",'"+rows[0].project_id+"')";//insert the user as an owner in the owner's table
														connection=connConstant.connection;
														connection.query(createCollabQuery, function(err, rows){
															//res.setHeader('Content-Type', 'application/json');
															if(err){
																var obj = '{'+ '"message": "'+ err.code +'"}';
																var Jobj=JSON.parse(obj);
																res.status(500).send(Jobj);
															}
															else if(rows){
																var obj = '{'+ '"message" : "collaborator '+google_email + ' added"}';
																var Jobj=JSON.parse(obj);
																res.status(201).send(Jobj);
															}															
														});
													}
													else{//the project does not exist we return a message
														var obj = '{'+ '"message" : "User with this scase_token does not own project ' + proj_name +' or project does not exist"}';
														var Jobj=JSON.parse(obj);
														res.status(401).send(Jobj);
													}
												});
											}
											else{
												//res.setHeader('Content-Type', 'application/json');
												var obj = '{'+ '"message": "user '+google_email + ' does not exist in S-Case"}';
												var Jobj=JSON.parse(obj);
												res.status(404).send(Jobj);
											}
										});
									}
									else if(ownerflag==false){
										//res.setHeader('Content-Type', 'application/json');
										var obj = '{"message": "User with this scase_signature does not exist in S-Case"}';
										var Jobj=JSON.parse(obj);
										res.status(404).send(Jobj);
									}
								});
		                	}else{
								var obj = '{"message": "User with this scase_signature does not exist in S-Case"}';
								var Jobj=JSON.parse(obj);
								res.status(404).send(Jobj);
	                		}
	                	}
	                	else{
								var obj = '{"message": "User with this scase_signature does not exist in S-Case"}';
								var Jobj=JSON.parse(obj);
								res.status(404).send(Jobj);
                		}
                	});
                }
                else {
					var obj = '{"message": "User with this scase_token does not exist in S-Case"}';
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