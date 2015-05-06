var role = "nothing";
module.exports = function(app){
	var mysql = require('mysql');
	var dbconfig = require('../../config/database');
	var connConstant = require('../../config/ConnectConstant');
	var connection;
	var ownerflag=false;//flag used to check if the user is an owner
	var jwt = require('jsonwebtoken');//
	//function to check if the user is owner of a specific project
	function checkIfOwner(scase_token,proj_name,scase_signature,callback){
		connection=connConstant.connection;
		var selectUsersQuery = "SELECT * FROM " + dbconfig.users_table + " WHERE scase_token = '" + scase_token + "'";
		connection.query(selectUsersQuery, function(err, rows){
            if (rows.length > 0) {
            	var user = rows[0];
                jwt.verify(scase_signature,rows[0].scase_secret,function(err,decoded){
            		if(err){
            			callback(ownerflag);
            		}
            		if(decoded){
            			if(decoded.scasetoken===scase_token){//we check if the produced signature is the same with the one provided
			            	var selectProjects = "SELECT `project_name` FROM " + dbconfig.projects_table +" JOIN " + dbconfig.owners_table + " ON "+ dbconfig.projects_table+
								".`project_id` = "+ dbconfig.owners_table + ".`project_id` "+" WHERE "+ dbconfig.owners_table+".`user_id` = '" + user.id + "'";
							console.log(decoded.scase_token)
							connection.query(selectProjects, function(err, rows){
								if (rows.length > 0) {
					            	for(var i in rows){
					        			if(rows[i].project_name===proj_name){
					        				ownerflag=true;
					        			}
					            	}
						        }
						        callback(ownerflag);
							});
						}
						else{
							callback(ownerflag);
						}
            		}
            		else{
            			callback(ownerflag);
            		}
            	});
            }
            else{
            	callback(ownerflag);
            }
	        
        });
	}
	// =============================================================================
	// Display the owners and collaborators of a project I Own API==================
	// =============================================================================
	app.get('/api/displayOwnersCollabs', function(req, res) {
		var scase_token= req.param('scase_token');
		var proj_name = req.param('project_name');//name of the project to manage
		var scase_signature = req.param('scase_signature');//require your scase_signature in order to authenticate
		res.setHeader('Content-Type', 'application/json');
		if(proj_name&&scase_token&&scase_signature){
			//flag that is going to be set to true only if own the project
			//function to check if I own the project
			ownerflag=false;
			checkIfOwner(scase_token,proj_name,scase_signature,function(ownerflag){
				if(ownerflag==true){
					var owners;//it is going to include all the owners (names and ids)
					var collaborators;//it is going to include all the collaborators (names and ids)
					function displayOwners (callback){
						//query to select all owners
						var selectOwnersQuery = "SELECT `google_email`,`github_name`,"+dbconfig.projects_table+".`project_id`," + dbconfig.owners_table + ".id AS owner_id FROM "  + dbconfig.users_table +" JOIN " + dbconfig.owners_table + 
						" ON "+ dbconfig.users_table + ".id=" +  dbconfig.owners_table+".user_id "+ "JOIN "+ dbconfig.projects_table+
						" ON "+ dbconfig.projects_table + ".project_id=" + dbconfig.owners_table + ".project_id" + 
						" WHERE " + dbconfig.projects_table + ".project_name=" + "'" + proj_name + "'";
						connection=connConstant.connection;
						connection.query(selectOwnersQuery, function(err, rows){
		                    if (rows.length > 0) {
		                    	owners=rows;
		                    }
		                    callback();
			            });
					}
					function displayCollaborators (callback){
						//query to select all collaborators
		        		var selectCollaboratorsQuery = "SELECT `google_email`,`github_name`," + dbconfig.collaborators_table + ".id AS `collab_id` FROM " + dbconfig.users_table +" JOIN " + dbconfig.collaborators_table + 
						" ON "+ dbconfig.users_table + ".id=" +  dbconfig.collaborators_table+".user_id "+ "JOIN "+ dbconfig.projects_table+
						" ON "+ dbconfig.projects_table + ".project_id=" + dbconfig.collaborators_table + ".project_id" + 
						" WHERE " + dbconfig.projects_table + ".project_name=" + "'" + proj_name + "'";
						connection=connConstant.connection;
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
							if(owners!=undefined||collaborators!=undefined){
								var obj = '[{'+ '"owners" : "';
								for (var i in owners){
									if(owners[i].github_name!=null){
										obj = obj + owners[i].github_name +",";
									}
									if(owners[i].google_email!=null){
										obj = obj + owners[i].google_email +",";
									}
								}
								obj = obj.substring(0,obj.length-1)+'"},';
								obj = obj + '{'+ '"collaborators" : "';
								for (var i in collaborators){
									if(collaborators[i].github_name!=null){
										obj = obj + collaborators[i].github_name +",";
									}
									if(collaborators[i].google_email!=null){
										obj = obj + collaborators[i].google_email +",";
									}
								}
								if(collaborators!=undefined){
									obj = obj.substring(0,obj.length-1)+'"}]';
								}
								else{
									obj = obj+'"}]';
								}
								//var obj=JSON.parse(obj);
								res.status(200).send(obj);
							}
							else{
								var obj = '{"message": "an error in mysql happened, sorry!"}';
								var Jobj=JSON.parse(obj);
								res.status(401).send(Jobj);
							}
							
						});
					});
				}
				else if(ownerflag==false){
					var obj = '{"message": "User with the given scase_token or signature does not own the project and/or the project does not exist in S-Case"}';
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