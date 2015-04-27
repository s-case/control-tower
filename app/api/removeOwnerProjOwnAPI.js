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
		//console.log(selectProjects)
		connection.query(selectProjects, function(err, rows){
			if (rows.length > 0) {
            	for(var i in rows){
        			if(rows[i].project_name==proj_name){
        				ownerflag=true;
        			}
            	}
	        }
		});
		callback(ownerflag);
	}
	// =============================================================================
	// Remove a collaborator from a project I own API===============================================
	// =============================================================================
	app.get('/api/removeOwnerProjOwn', function(req, res) {
		var scase_token= req.param('scase_token');
		var scase_signature = req.param('scase_signature');//require your scase_signature in order to authenticate
		var proj_name= req.param('project_name');
		var github_name = req.param('github_name');
		if(scase_token&&proj_name&&github_name&&scase_signature){
			connection=connConstant.connection;
			//we select the user with the scase_token provided 
			var selectUsersQuery = "SELECT * FROM " + dbconfig.users_table + " WHERE scase_token = '" + scase_token + "'";
			connection.query(selectUsersQuery, function(err, rows){
                if (rows.length > 0) {
                	var decoded = jwt.verify(scase_signature,rows[0].scase_secret);
					if(decoded.scasetoken=scase_token){//we check if the produced signature is the same with the one provided
	                	var user = rows[0];
	                	connection = connConstant.connection;
	                	var ownerflag;
	                	checkIfOwner(user,proj_name,function(ownerflag){
							if(ownerflag==true){
								var selectCollabQuery = "SELECT * FROM " + dbconfig.users_table + " WHERE github_name = '" + github_name + "'";//select the user's details with the provided github name
				              	connection.query(selectCollabQuery, function(err, rows){
				              		var removeCollabQuery = "DELETE FROM " + dbconfig.owners_table+
									" WHERE " + dbconfig.owners_table + ".user_id=" + "'" + rows[0].id + "'";
									connection=connConstant.connection;
									connection.query(removeCollabQuery, function(err, rows){
					                    res.setHeader('Content-Type', 'application/json');
										var obj = '{'+ '"owner '+github_name + '": "deleted"}';
										if(err){
											var obj = '{'+ '"owner '+github_name + '": "not deleted"}';
										}
										var Jobj=JSON.parse(obj);
										res.send(Jobj);
				                	});

				              	});
							}
							else if(ownerflag==false){
								res.setHeader('Content-Type', 'application/json');
								var obj = '{'+ '"User with scase_token  '+scase_token + '": "does not own project ' + proj_name +' or the project does not exist"}';
								var Jobj=JSON.parse(obj);
								res.send(Jobj);
							}
						});
					}
                	else{
                		 res.setHeader('Content-Type', 'application/json');
						var obj = '{'+ '"User with scase_signature: '+scase_signature + '": "does not exist in S-Case"}';
						var Jobj=JSON.parse(obj);
						res.send(Jobj);
                	}
                }
                else {
                    res.setHeader('Content-Type', 'application/json');
					var obj = '{'+ '"User with scase_token  '+scase_token + '": "does not exist in S-Case"}';
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