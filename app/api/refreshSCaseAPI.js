var role = "nothing";
module.exports = function(app){
	var mysql = require('mysql');
	var dbconfig = require('../../config/database');
	var connConstant = require('../../config/ConnectConstant');
	var connection;
	// =============================================================================
	// Refresh S-CASE token ACCOUNTS API===============================================
	// =============================================================================
	//we create a new scase token
	var crypto = require('crypto');
	var base64url = require('base64url');
	//function to crete an S-CASE token
	function scasetokenCreate(size){
	    return base64url(crypto.randomBytes(size));
	}
	app.get('/api/refreshSCASEtoken',function(req,res){
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
			                var scasetoken = scasetokenCreate(35)//we create a new scase token
			                user.scase_token=scasetoken;
			                //query to update the token
			                var updateQuery = "UPDATE " + dbconfig.users_table + " SET " +
			                        "`scase_token` = '" + user.scase_token + "' " +
			                        "WHERE `id` = '" + user.id + "' LIMIT 1"; 
	                        connection = connConstant.connection;
			                connection.query(updateQuery, function(err, rows) {
			                  	res.setHeader('Content-Type', 'application/json');
								if (err){
				                    res.setHeader('Content-Type', 'application/json');
									var obj = '{'+ '"User with scase_token  '+scase_token + '": "does not exist in S-Case"}';
									var Jobj=JSON.parse(obj);
									res.send(Jobj);
								}
								else{
									var obj = '{'+ '"newSCASEtoken" : "'+scasetoken+'"}';
									var Jobj=JSON.parse(obj);
									res.send(Jobj);
								}
			                });
			            }
			        });
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
			var obj = '{'+ '"message": "you miss scase token"}';
			var Jobj=JSON.parse(obj);
			res.send(Jobj);
		}
	});
};