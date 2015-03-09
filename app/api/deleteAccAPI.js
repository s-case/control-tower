var role = "nothing";
module.exports = function(app){
	var mysql = require('mysql');
	var dbconfig = require('../../config/database');
	var connConstant = require('../../config/ConnectConstant');
	var connection;
	// =============================================================================
	// Delete account API =============================================================
	// =============================================================================
	app.get('/api/deleteUser',function(req,res){
		var scase_token=req.param('scase_token');
		if(scase_token){
			connection = connConstant.connection;
			//we select the user with the scase_token provided 
			var selectUsersQuery = "SELECT * FROM " + dbconfig.users_table + " WHERE scase_token = '" + scase_token + "'";
			connection.query(selectUsersQuery, function(err, rows){
                if (rows.length > 0) {
                	var user_id = rows[0].id;
                	//delete any project I am the only owner (the only large SQL statement)
		        	var DeleteProjectsOnlyOwnerQuery = "DELETE FROM " + dbconfig.projects_table + 
		        		" WHERE " + dbconfig.projects_table + ".project_id IN (SELECT project_id "+
			        	"FROM (SELECT * FROM " + dbconfig.owners_table + 
			        	" WHERE " +dbconfig.owners_table +".project_id IN (SELECT project_id FROM " +
			        	dbconfig.owners_table + " WHERE "+ dbconfig.owners_table + ".user_id=" + user_id +
			        	")) AS projectsofuser GROUP BY project_id HAVING COUNT(project_id)=1)";
					console.log(DeleteProjectsOnlyOwnerQuery);
		            connection = connConstant.connection;
		            connection.query(DeleteProjectsOnlyOwnerQuery, function(err, rows) {
		                //delete from owners
						var DeleteFromOwnerQuery = "DELETE FROM " + dbconfig.owners_table +                          
			                                " WHERE `user_id` = " + user_id;
		                console.log(DeleteFromOwnerQuery);
		                connection = connConstant.connection;
		                connection.query(DeleteFromOwnerQuery, function(err, rows) {
		            		var DeleteFromCollabQuery = "DELETE FROM " + dbconfig.collaborators_table +                          
		                                " WHERE `user_id` = " + user_id;
		                    console.log(DeleteFromCollabQuery);
		                    connection = connConstant.connection;
		                    connection.query(DeleteFromCollabQuery, function(err, rows) {
		                    	var DeleteFromUsersQuery = "DELETE FROM " + dbconfig.users_table +                          
		                			" WHERE `id` = " + user_id;
		            			console.log(DeleteFromUsersQuery);
		    				  	connection.query(DeleteFromUsersQuery, function(err, rows) {
		                            	res.setHeader('Content-Type', 'application/json');
										var obj = '{'
												+ '"userDeleted" : "true"'
												+ '}';
										var Jobj=JSON.parse(obj);
										res.send(Jobj);
		                        });
		                    });
		                });
		        	});
                }
                else {
                    //res.setHeader('Content-Type', 'application/json');
					var obj = '{'+ '"User with scase_token  '+scase_token + '": "do not exist in S-Case"}';
					var Jobj=JSON.parse(obj);
					res.send(Jobj);
				}
			});
		}
	});
};