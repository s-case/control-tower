var role = "nothing";
module.exports = function(app){
	var mysql = require('mysql');
	var dbconfig = require('../../config/database');
	var connConstant = require('../../config/ConnectConstant');
	var connection;
	var jwt = require('jsonwebtoken');//
	// =============================================================================
	// Refresh S-CASE token ACCOUNTS API===============================================
	// =============================================================================
	//we create a new scase token
	var crypto = require('crypto');
	var base64url = require('base64url');
	//function to crete an S-CASE secret
	function scasetokenCreate(size){
	    return base64url(crypto.randomBytes(size));
	}
	app.put('/api/refreshSCASEsecret',function(req,res){
		var scase_token=req.param('scase_token');
		var scase_signature = req.param('scase_signature');//require your scase_signature in order to authenticate
		res.setHeader('Content-Type', 'application/json');
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
						                var scasesecret = scasetokenCreate(35)//we create a new scase token
						                user.scase_secret=scasesecret;
						                //query to update the token
						                var updateQuery = "UPDATE " + dbconfig.users_table + " SET " +
						                        "`scase_secret` = '" + user.scase_secret + "' " +
						                        "WHERE `id` = '" + user.id + "' LIMIT 1"; 
				                        connection = connConstant.connection;
						                connection.query(updateQuery, function(err, rows) {
											if (err){
												var obj = '{"message": "User with this scase_token does not exist in S-Case"}';
												var Jobj=JSON.parse(obj);
												res.status(401).send(Jobj);
											}
											else{
												var obj = '{'+ '"newSCASEsecret" : "'+scasesecret+'"}';
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
								res.status(401).send(Jobj);
		                	}
                		}else{
							var obj = '{"message": "User with this scase_signature does not exist in S-Case"}';
							var Jobj=JSON.parse(obj);
							res.status(401).send(Jobj);
	                	}
                	});
					
                }
                else {
					var obj = '{"message": "User with this scase_token does not exist in S-Case"}';
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