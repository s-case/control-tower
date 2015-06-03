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
		//console.log(selectProjects);
		connection.query(selectProjects, function(err, rows){
			if (rows.length > 0) {
            	for(var i in rows){
        			if(rows[i].project_name===proj_name){
        				ownerflag=true;
        			}
            	}
	        }
	        //console.log(ownerflag);
	        callback(ownerflag);
		});
	}
	// =============================================================================
	// Delete a project I own API===============================================
	// =============================================================================
	app.delete('/api/deleteProjectOwn', function(req, res) {
		var scase_token= req.param('scase_token');
		var proj_name= req.param('project_name');
		var scase_signature = req.param('scase_signature');//require your scase_signature in order to authenticate
		res.setHeader('Content-Type', 'application/json');
		if(scase_token&&proj_name&&scase_signature){
			connection=connConstant.connection;
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
			                	var user = rows[0];
			                	connection = connConstant.connection;
			                	ownerflag=false;
								checkIfOwner(user,proj_name,function(ownerflag){
									if(ownerflag==true){
										var deleteProjectQuery = "DELETE FROM " + dbconfig.projects_table+
											" WHERE " + dbconfig.projects_table + ".project_name=" + "'" + proj_name + "'";//query to delete project
										//console.log(deleteProjectQuery);
										connection=connConstant.connection;
										connection.query(deleteProjectQuery, function(err, rows){
											if(err){
												var obj = '{'+ '"message": "'+ err.code +'"}';
												var Jobj=JSON.parse(obj);
												res.status(500).send(Jobj);
											}
											else if(rows){
												//first get the project JSON and then delete the project using its id in the Art Registry
												request(ArtRepoURL+'assetregistry/project/'+proj_name, function (error, response, body){
													var projectData = JSON.parse(body);//we get the whole project and then use its id to delete the project
													request.del(ArtRepoURL+'assetregistry/project/'+projectData.id,function(error,response){
														var obj = '{'+ '"message": "project '+ proj_name + ' deleted"}';
														var Jobj=JSON.parse(obj);
														res.status(200).send(Jobj);
													});
												}); 
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