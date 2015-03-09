var role = "nothing";
module.exports = function(app){
	var mysql = require('mysql');//it loads the mysql package
	var dbconfig = require('../../config/database');//it loads the configuration of the database
	var connConstant = require('../../config/ConnectConstant');//it loads a module that ensure continuous connection to the database
	var connection;//variable used for the connection to the database
	var ownerflag=false;//flag used to check if the user is an owner
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
        			if(rows[i].project_name==proj_name){
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
	app.get('/api/addCollabProjOwn', function(req, res) {
		res.setHeader('Content-Type', 'application/json');
		var scase_token= req.param('scase_token');
		var proj_name= req.param('project_name');
		var github_name = req.param('github_name');
		if(scase_token&&proj_name&&github_name){
			connection=connConstant.connection;
			//we select the user with the scase_token provided 
			var selectUsersQuery = "SELECT * FROM " + dbconfig.users_table 
				+ " WHERE scase_token = '" + scase_token + "'";
			connection.query(selectUsersQuery, function(err, rows){
                if (rows.length > 0) {
                	var user = rows[0];
                	connection = connConstant.connection;
                	var ownerflag;
                	checkIfOwner(user,proj_name,function(ownerflag){
                		console.log(ownerflag);
						if(ownerflag==true){//if the user owns the project we proceed
							var checkIfUserExistsQuery = "SELECT id FROM " + dbconfig.users_table + " WHERE " +
								dbconfig.users_table +".github_name=" + "'" + github_name +"'";
							//we are goint to check if the user that we are asked to add exists
							connection=connConstant.connection;
							connection.query(checkIfUserExistsQuery, function(err,rows){
								if(rows.length>0){
									var user_id = rows[0].id
									//if the user exists, we get the project's id
									var getProjectId = "SELECT project_id FROM " + dbconfig.projects_table + " WHERE project_name="+ "'"
													+ proj_name +"'";
									connection=connConstant.connection;
									connection.query(getProjectId, function(err, rows){
										if(rows.length>0){//clause if the project exists
											//query to insert a collaborator
											var createCollabQuery = "INSERT INTO " +dbconfig.collaborators_table+ "(user_id,project_id)" +
												" VALUES (" + "'"+ user_id + "'"+ ",'"+rows[0].project_id+"')";//then insert the user as an owner in the owner's table
											connection=connConstant.connection;
											connection.query(createCollabQuery, function(err, rows){
												//res.setHeader('Content-Type', 'application/json');
												var obj = '{'+ '"collaborator '+github_name + '": "added"}';
												if(err){
													var obj = '{'+ '"collaborator '+github_name + '": "not added"}';
												}
												var Jobj=JSON.parse(obj);
												res.send(Jobj);
											});
										}
										else{//the project does not exist we return a message
											//res.setHeader('Content-Type', 'application/json');
											var obj = '{'+ '"Project '+proj_name + '": "does not exist'+'"}';
											var Jobj=JSON.parse(obj);
											res.send(Jobj);
										}
									});
								}
								else{
									//res.setHeader('Content-Type', 'application/json');
									var obj = '{'+ '"user with '+github_name + '": "does not exist in S-Case"}';
									var Jobj=JSON.parse(obj);
									res.send(Jobj);
								}
							});
						}
						else if(ownerflag==false){
							//res.setHeader('Content-Type', 'application/json');
							var obj = '{'+ '"User with scase_token '+scase_token + '": "does not own project ' + proj_name +' or project does not exist"}';
							var Jobj=JSON.parse(obj);
							res.send(Jobj);
						}
					});
                }
                else {
                    res.setHeader('Content-Type', 'application/json');
					var obj = '{'+ '"User with scase_token  '+scase_token + '": "do not exist in S-Case"}';
					var Jobj=JSON.parse(obj);
					res.send(Jobj);
				}
            });
		}
		else{
			//res.setHeader('Content-Type', 'application/json');
			var obj = '{'+ '"message": "you miss some parameters"}';
			var Jobj=JSON.parse(obj);
			res.send(Jobj);
		}
	});
};