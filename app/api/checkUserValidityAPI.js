var role = "nothing";
module.exports = function(app){

var mysql = require('mysql');
var dbconfig = require('../../config/database');
var connConstant = require('../../config/ConnectConstant');
var connection;
//var jwt = require('express-jwt');
var jwt = require('jsonwebtoken');//require json web token package
// ROUTES FOR OUR API
// =============================================================================
//route for the S-CASE tools that do not store data
//in order to check if a token is an S-CASE token
app.get('/api/validateUser',function(req,res){
	var scase_token= req.param('scase_token');//require your scase token in order to authenticate
	var scase_signature = req.param('scase_signature');//require your scase_signature in order to authenticate
	res.setHeader('Content-Type', 'application/json');		
	if(scase_token&&scase_signature){
		connection=connConstant.connection;
		connection.query('USE ' + dbconfig.database);
		//query to get the secret of the user
		var GetSecretQuery = "SELECT " + dbconfig.users_table + ".`scase_secret` AS scaseSecret FROM "+ dbconfig.users_table + " WHERE " +
							dbconfig.users_table + ".`scase_token`= '"+ scase_token + "' ";
		var selectQuery = "SELECT COUNT(*) AS usersCount FROM " + dbconfig.users_table + " WHERE "+
							"`scase_token` = '" + scase_token + "' ";
		connection.query(GetSecretQuery,function(err,rows){
			if (err||rows.length<1){
				var obj = '{"message": "User Not Valid"}';
				var Jobj=JSON.parse(obj);
				res.status(400).send(Jobj);
			}
			if(rows.length>0){
				jwt.verify(scase_signature,rows[0].scaseSecret,function(err,decoded){
	        		if(err){
	        			var obj = '{"message": "User Not Valid"}';
						var Jobj=JSON.parse(obj);
						res.status(400).send(Jobj);
	        		}
	        		if(decoded){
	        			if(decoded.scasetoken=scase_token){
							connection.query(selectQuery, function(err, rows){
								if (err||rows.length<1){
									var obj = '{"message": "User Not Valid"}';
									var Jobj=JSON.parse(obj);
									res.status(400).send(Jobj);
								}
								
								var userCnt = parseInt(rows[0].usersCount);
								//console.log(userCnt);
								if(userCnt==1){
									var obj = '{"message": "User Valid"}';
									var Jobj=JSON.parse(obj);
									res.status(200).send(Jobj);
								}
								else {
									var obj = '{"message": "User Not Valid"}';
									var Jobj=JSON.parse(obj);
									res.status(400).send(Jobj);
								}
							});
						}
						else{
							var obj = '{"message": "User Not Valid"}';
							var Jobj=JSON.parse(obj);
							res.status(400).send(Jobj);
	        			}
	        		}
	        		else{
	    				var obj = '{"message": "User Not Valid"}';
						var Jobj=JSON.parse(obj);
						res.status(400).send(Jobj);
					}
				});
			}
			else{
				var obj = '{"message": "User Not Valid"}';
				var Jobj=JSON.parse(obj);
				res.status(400).send(Jobj);
			}
		});
	}
	else{
		var obj = '{'+ '"message": "you miss some parameters"}';
		var Jobj=JSON.parse(obj);
		res.status(400).send(Jobj);
	}
});
};