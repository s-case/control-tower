var role = "nothing";
module.exports = function(app){
	var mysql = require('mysql');
	var dbconfig = require('../../config/database');
	var connConstant = require('../../config/ConnectConstant');
	var jwt = require('jsonwebtoken');//
	var connection;
	// =============================================================================
	// Display the owners and collaborators of a project I Own API===============================================
	// =============================================================================
	app.get('/api/displayProjectsCollab', function(req, res) {
		var scase_token= req.param('scase_token');
		var scase_signature = req.param('scase_signature');//require your scase_signature in order to authenticate
		if(scase_token&&scase_signature){
			connection=connConstant.connection;
			//we select the user with the scase_token provided 
			var selectUsersQuery = "SELECT * FROM " + dbconfig.users_table + " WHERE scase_token = '" + scase_token + "'";
			connection.query(selectUsersQuery, function(err, rows){
                if (rows.length > 0) {
                	var decoded = jwt.verify(scase_signature,rows[0].scase_secret);
					if(decoded.scasetoken=scase_token){//we check if the produced signature is the same with the one provided
	                	var user = rows[0];
	                	connection = connConstant.connection;
	                	var selectProjectCollab = "SELECT `project_name` FROM " + dbconfig.projects_table +" JOIN " + dbconfig.collaborators_table + " ON "+ dbconfig.projects_table+
							".`project_id` = "+ dbconfig.collaborators_table + ".`project_id` "+" WHERE "+ dbconfig.collaborators_table+".`user_id` = '" + user.id + "'";
						connection.query(selectProjectCollab, function(err, rows){
				                if (rows.length > 0) {//if there are projects I collaborate I show them
				                	res.setHeader('Content-Type', 'application/json');
									var obj = '{'+ '"projectnames-Collab" : "';
									for (var i in rows){
										obj = obj + rows[i].project_name +","
									}
									obj = obj.substring(0,obj.length-1)+'"}';
									var Jobj=JSON.parse(obj);
									res.send(Jobj);
				                }
				                else{
				                	res.setHeader('Content-Type', 'application/json');
				                	var obj = '{"projectnames-Collab" : "no project You collaborate on"}';
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
			var obj = '{'+ '"message": "you miss the scase_token"}';
			var Jobj=JSON.parse(obj);
			res.send(Jobj);
		}
	});
};