var role = "nothing";
module.exports = function(app){
	var mysql = require('mysql');
	var dbconfig = require('../../config/database');
	var connConstant = require('../../config/ConnectConstant');
	var connection;
	var ownerflag=false;//flag used to check if the user is an owner
	//function to check if the user is owner of a specific project
	function checkIfOwner(scase_token,proj_name,callback){
		connection=connConstant.connection;
		var selectUsersQuery = "SELECT * FROM " + dbconfig.users_table + " WHERE scase_token = '" + scase_token + "'";
		connection.query(selectUsersQuery, function(err, rows){
            if (rows.length > 0) {
            	var user = rows[0];
            	var selectProjects = "SELECT `project_name` FROM " + dbconfig.projects_table +" JOIN " + dbconfig.owners_table + " ON "+ dbconfig.projects_table+
					".`project_id` = "+ dbconfig.owners_table + ".`project_id` "+" WHERE "+ dbconfig.owners_table+".`user_id` = '" + user.id + "'";
				console.log(selectProjects)
				connection.query(selectProjects, function(err, rows){
					if (rows.length > 0) {
		            	for(var i in rows){
		        			if(rows[i].project_name==proj_name){
		        				ownerflag=true;
		        			}
		            	}
			        }
				});
            }
            console.log(ownerflag);
	        callback(ownerflag);
            
        });
		
	}
	// =============================================================================
	// Display the owners and collaborators of a project I Own API===============================================
	// =============================================================================
	app.get('/api/displayOwnersCollabs', function(req, res) {
		var scase_token= req.param('scase_token');
		var proj_name = req.param('project_name');//name of the project to manage
		if(proj_name&&scase_token){
			//flag that is going to be set to true only if own the project
			//function to check if I own the project
			checkIfOwner(scase_token,proj_name,function(ownerflag){
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
		        		var selectCollaboratorsQuery = "SELECT `github_name`," + dbconfig.collaborators_table + ".id AS `collab_id` FROM " + dbconfig.users_table +" JOIN " + dbconfig.collaborators_table + 
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
							res.setHeader('Content-Type', 'application/json');
							var obj = '[{'+ '"owners" : "';
							for (var i in owners){
								obj = obj + owners[i].github_name +","
							}
							obj = obj.substring(0,obj.length-1)+'"},';
							obj = obj + '{'+ '"collaborators" : "';
							for (var i in collaborators){
								obj = obj + collaborators[i].github_name +","
							}
							obj = obj.substring(0,obj.length-1)+'"}]';
							//var obj=JSON.parse(obj);
							res.send(obj);
						});
					});
				}
				else if(ownerflag==false){
                    res.setHeader('Content-Type', 'application/json');
					var obj = '{'+ '"User with scase_token '+scase_token + '": "do not own the project and/or the project does not exist in S-Case"}';
					var Jobj=JSON.parse(obj);
					res.send(Jobj);
				}
			});	
		}
		else{
			res.setHeader('Content-Type', 'application/json');
			var obj = '{'+ '"message": "you miss some parameters"}';
			var Jobj=JSON.parse(obj);
			res.send(Jobj);
		}
	});
};