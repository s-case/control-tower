var role = "nothing";
module.exports = function(app){
	var mysql = require('mysql');//it loads the mysql package
	var dbconfig = require('../../config/database');//it loads the configuration of the database
	var connConstant = require('../../config/ConnectConstant');//it loads a module that ensure continuous connection to the database
	var connection;//variable used for the connection to the database
	var ownerflag=false;//flag used to check if the user is an owner
	var jwt = require('jsonwebtoken');//
	// =============================================================================
	// Create a project I own API===================================
	// =============================================================================
	app.get('/api/createProjOwn', function(req, res) {
		res.setHeader('Content-Type', 'application/json');
		var scase_token= req.param('scase_token');//require your scase token in order to authenticate
		var scase_signature = req.param('scase_signature');//require your scase_signature in order to authenticate
		var proj_name= req.param('project_name');//require project name
		var privacy_level='private';
		if(scase_token&&proj_name&&scase_signature){
			connection=connConstant.connection;//ensure that there is a connection to the DB
			//we select the user with the scase_token provided 
			var selectUsersQuery = "SELECT * FROM " + dbconfig.users_table + " WHERE scase_token = '" + scase_token + "'";//query to get all the info of the user with the provided scase token
			connection.query(selectUsersQuery, function(err, rows){
                if (rows.length > 0) {
                	jwt.verify(scase_signature,rows[0].scase_secret,function(err,decoded){
                		if(err){
							var obj = '{"message": "User with scase_signature '+scase_signature + 'does not exist in S-Case"}';
							var Jobj=JSON.parse(obj);
							res.status(401).send(Jobj);
                		}
                		if(decoded){
							if(decoded.scasetoken==scase_token){//we check if the produced signature is the same with the one provided
		                		var user = rows[0];
		                		var createProjectQuery = "INSERT INTO " + dbconfig.projects_table +
										" (project_name,privacy_level)" +
										" VALUES ("+ "'" + proj_name+"','"+privacy_level+"')";//query to create the project
								//console.log(createProjectQuery);
								connection=connConstant.connection;
								connection.query(createProjectQuery, function(err, rows){
									if(rows){
										var getProjectId = "SELECT project_id FROM " + dbconfig.projects_table + " WHERE project_name="+ "'"
													+ proj_name +"'";//query to get the project's ID to insert in the Owners table as a project the user owns
										connection=connConstant.connection;
										//console.log(getProjectId);
										connection.query(getProjectId, function(err, rows){
											if(rows.length>0){
												var createOwnerQuery = "INSERT INTO " +dbconfig.owners_table+ "(user_id,project_id)" +
												" VALUES (" + "'"+ user.id + "'"+ ",'"+rows[0].project_id+"')";
												connection=connConstant.connection;
												//console.log(createOwnerQuery);
												connection.query(createOwnerQuery, function(err, rows){
													if(err){
														var obj = '{'+ '"message": "'+ err.code +'"}';
														var Jobj=JSON.parse(obj);
														res.status(500).send(Jobj);
													}
													else if(rows){
														var obj = '{'+ '"message": "'+proj_name + 'created"}';
														var Jobj=JSON.parse(obj);
														res.status(201).send(Jobj);
													}
												});
											}
											else{
												var obj = '{'+ '"message": "mysql failure, project cannot be created"}';
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
										var obj = '{"message": "project cannot be created (project name already exists)"}';
										var Jobj=JSON.parse(obj);
										res.status(409).send(Jobj);
									}
						        }); 
		                	}
		                	else{
								var obj = '{"message": "User with scase_signature '+scase_signature + 'does not exist in S-Case"}';
								var Jobj=JSON.parse(obj);
								res.status(401).send(Jobj);
	                		}
	                	}
	                	else{
							var obj = '{"message": "User with scase_signature '+scase_signature + 'does not exist in S-Case"}';
							var Jobj=JSON.parse(obj);
							res.status(401).send(Jobj);
	                	}
                	});
                }
                else {
					var obj = '{"message": "User with scase_signature '+scase_signature + 'does not exist in S-Case"}';
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