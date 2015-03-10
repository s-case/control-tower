var role = "nothing";
module.exports = function(app){
	var mysql = require('mysql');
	var dbconfig = require('../../config/database');
	var connConstant = require('../../config/ConnectConstant');
	var connection;
	var ownerflag=false;//flag used to check if the user is an owner
	//function to check if the user is owner of a specific project
	function checkIfOwner(user,proj_name,callback){
		connection=connConstant.connection;
		var selectProjects = "SELECT `project_name` FROM " + dbconfig.projects_table +" JOIN " + dbconfig.owners_table + " ON "+ dbconfig.projects_table+
		".`project_id` = "+ dbconfig.owners_table + ".`project_id` "+" WHERE "+ dbconfig.owners_table+".`user_id` = '" + user.id + "'";
		//console.log(selectProjects);
		connection.query(selectProjects, function(err, rows){
			if (rows.length > 0) {
            	for(var i in rows){
        			if(rows[i].project_name==proj_name){
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
	app.get('/api/deleteProjectOwn', function(req, res) {
		var scase_token= req.param('scase_token');
		var proj_name= req.param('project_name');
		if(scase_token&&proj_name){
			connection=connConstant.connection;
			//we select the user with the scase_token provided 
			var selectUsersQuery = "SELECT * FROM " + dbconfig.users_table + " WHERE scase_token = '" + scase_token + "'";
			connection.query(selectUsersQuery, function(err, rows){
                if (rows.length > 0) {
                	var user = rows[0];
                	connection = connConstant.connection;
                	var ownerflag;
					checkIfOwner(user,proj_name,function(ownerflag){
						if(ownerflag==true){
							var deleteProjectQuery = "DELETE FROM " + dbconfig.projects_table+
								" WHERE " + dbconfig.projects_table + ".project_name=" + "'" + proj_name + "'";//query to delete project
							//console.log(deleteProjectQuery);
							connection=connConstant.connection;
							connection.query(deleteProjectQuery, function(err, rows){
			                    res.setHeader('Content-Type', 'application/json');
								var obj = '{'+ '"project '+proj_name + '": "deleted"}';
								if(err){
									var obj = '{'+ '"project '+proj_name + '": "not deleted"}';
								}
								var Jobj=JSON.parse(obj);
								res.send(Jobj);
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
					var obj = '{'+ '"User with scase_token  '+scase_token + '": "do not exist in S-Case"}';
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