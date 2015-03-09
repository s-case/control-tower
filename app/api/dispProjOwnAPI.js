var role = "nothing";
module.exports = function(app){
	var mysql = require('mysql');
	var dbconfig = require('../../config/database');
	var connConstant = require('../../config/ConnectConstant');
	var connection;
	// =============================================================================
	// Display the Projects I Own API===============================================
	// =============================================================================
	app.get('/api/displayProjectsOwn',function(req,res){
		var scase_token=req.param('scase_token');
		if(scase_token){
			connection = connConstant.connection;
			//we select the user with the scase_token provided 
			var selectUsersQuery = "SELECT * FROM " + dbconfig.users_table + " WHERE scase_token = '" + scase_token + "'";
			connection.query(selectUsersQuery, function(err, rows){
                if (rows.length > 0) {
                	var user = rows[0];
                	connection = connConstant.connection;
					//we select the user from the user's table (just to check if the user exists)
					connection.query("SELECT * FROM " + dbconfig.users_table + " WHERE id = '" + user.id + "'", function(err, rows){
			            if (rows.length > 0) {
			                user = rows[0];
			                //query for the projects I own
							var projectsOwnedQuery = "SELECT `project_name` FROM " + dbconfig.projects_table +" JOIN " + dbconfig.owners_table + " ON "+ dbconfig.projects_table+
								".`project_id` = "+ dbconfig.owners_table + ".`project_id` "+" WHERE "+ dbconfig.owners_table+".`user_id` = '" + user.id + "'";
							connection.query(projectsOwnedQuery, function(err, rows){
					            if (rows.length > 0) {
					            	res.setHeader('Content-Type', 'application/json');
										var obj = '{'+ '"projectnames-Own" : "';
										for (var i in rows){
											obj = obj + rows[i].project_name +","
										}
										obj = obj.substring(0,obj.length-1)+'"}';
										var Jobj=JSON.parse(obj);
										res.send(Jobj);
								}
								else {
					            	res.setHeader('Content-Type', 'application/json');
									var obj = '{"projectnames-Own" : "no projects you Own"}';
									var Jobj=JSON.parse(obj);
									res.send(Jobj);
								}
				            });
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
			var obj = '{'+ '"message": "you miss the scase token"}';
			var Jobj=JSON.parse(obj);
			res.send(Jobj);
		}
	});
};