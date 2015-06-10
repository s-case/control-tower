var role = "nothing";
module.exports = function(app){
	var mysql = require('mysql');
	var dbconfig = require('../../config/database');
	var connConstant = require('../../config/ConnectConstant');
	var connection;
	var jwt = require('jsonwebtoken');//
	// =============================================================================
	// Display the Projects I Own API===============================================
	// =============================================================================
	app.get('/api/displayProjectsOwn',function(req,res){
		res.setHeader('Content-Type', 'application/json');
		var scase_token=req.param('scase_token');
		var scase_signature = req.param('scase_signature');//require your scase_signature in order to authenticate
		if(scase_token&&scase_signature){
			connection = connConstant.connection;
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
                			if(decoded.scasetoken=scase_token){//we check if the produced signature is the same with the one provided
			                	var user = rows[0];
			                	connection = connConstant.connection;
								//we select the user from the user's table (just to check if the user exists)
								connection.query("SELECT * FROM " + dbconfig.users_table + " WHERE id = '" + user.id + "'", function(err, rows){
						            if(err){
										var obj = '{'+ '"message": "'+ err.code +'"}';
										var Jobj=JSON.parse(obj);
										res.status(500).send(Jobj);
									}
						            else if (rows.length > 0) {
						                user = rows[0];
						                //query for the projects I own
										var projectsOwnedQuery = "SELECT `project_name` FROM " + dbconfig.projects_table +" JOIN " + dbconfig.owners_table + " ON "+ dbconfig.projects_table+
											".`project_id` = "+ dbconfig.owners_table + ".`project_id` "+" WHERE "+ dbconfig.owners_table+".`user_id` = '" + user.id + "'";
										connection.query(projectsOwnedQuery, function(err, rows){
								            if (rows.length > 0) {
												var obj = '{'+ '"projectnames-Own" : "';
												for (var i in rows){
													obj = obj + rows[i].project_name +","
												}
												obj = obj.substring(0,obj.length-1)+'"}';
												var Jobj=JSON.parse(obj);
												res.status(200).send(Jobj);
											}
											else {
												var obj = '{"projectnames-Own" : ""}';
												var Jobj=JSON.parse(obj);
												res.status(200).send(Jobj);
											}
							            });
							        }
							    });
							}
							else{
								var obj = '{"message": "User with this scase_signature does not exist in S-Case"}';
								var Jobj=JSON.parse(obj);
								res.status(404).send(Jobj);
                			}	
                		}else{
								var obj = '{"message": "User with this scase_signature does not exist in S-Case"}';
								var Jobj=JSON.parse(obj);
								res.status(404).send(Jobj);
	                	}
                	});
	            }
	            else if (err){
						var obj = '{'+ '"message": "'+ err.code +'"}';
						var Jobj=JSON.parse(obj);
						res.status(500).send(Jobj);
	            }
	            else{
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