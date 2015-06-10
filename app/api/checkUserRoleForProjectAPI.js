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
//in order to check if the role of a user
app.get('/api/checkUserRole',function(req,res){
	var scase_token= req.param('scase_token');//require your scase token in order to authenticate
	var project_name= req.param('project_name');//require project name
	var scase_signature = req.param('scase_signature');//require your scase_signature in order to authenticate
	res.setHeader('Content-Type', 'application/json');		
	if(scase_token && scase_signature && project_name){
		connection=connConstant.connection;
		connection.query('USE ' + dbconfig.database);
		//query to get the secret of the user
		var GetSecretQuery = "SELECT " + dbconfig.users_table + ".`scase_secret` AS scaseSecret FROM "+dbconfig.users_table+" WHERE " +
							dbconfig.users_table + ".`scase_token`= '"+ scase_token + "' ";
							console.log(GetSecretQuery);
		//query to check if the user is owner		
		var OwnerSelectQuery = "SELECT COUNT(*) AS usersCount FROM " + dbconfig.users_table + " INNER JOIN (" +dbconfig.owners_table +","+
							dbconfig.projects_table+") ON "+
							dbconfig.users_table+".`id`="+dbconfig.owners_table+".`user_id` AND " +
							dbconfig.owners_table+".`project_id`="+dbconfig.projects_table+".`project_id` WHERE "+
							dbconfig.projects_table+".`project_name`= '" + project_name + "' AND " +
							dbconfig.users_table+".`scase_token`= '" + scase_token + "' ";
		//query to check if the user is collaborator		
		var CollaboratorSelectQuery = "SELECT COUNT(*) AS usersCount FROM " + dbconfig.users_table + " INNER JOIN ("+ dbconfig.collaborators_table+","+
							dbconfig.projects_table+") ON "+
							dbconfig.users_table+".`id`="+dbconfig.collaborators_table+".`user_id` AND " +
							dbconfig.collaborators_table+".`project_id`="+dbconfig.projects_table+".`project_id` WHERE "+
							dbconfig.projects_table+".`project_name`= '" + project_name + "' AND " +
							dbconfig.users_table+".`scase_token`= '" + scase_token + "' ";					
		var role = "nothing";
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
	        				var ownerflag=false;
							connection.query(OwnerSelectQuery, function(err, rows){//check if the user is owner
								if (err||rows.length<1){
									var obj = '{"message": "User Not Valid"}';
									var Jobj=JSON.parse(obj);
									res.status(400).send(Jobj);
								}
								var userCnt = parseInt(rows[0].usersCount);
								//console.log("Owners Number:"+userCnt);
								if(userCnt==1){
									role="owner";
								}
								if(role!=="nothing"){
									ownerflag=true;
									var userInfo = [{"message" : "User Valid"},{"userRole" : role}];
									//var Jobj=JSON.parse(userInfo);
									res.status(200).send(userInfo);
								}
								connection=connConstant.connection;
								if(ownerflag==false){
									connection.query(CollaboratorSelectQuery, function(err, rows){
										if (err||rows.length<1){
											var obj = '{"message": "User Not Valid"}';
											var Jobj=JSON.parse(obj);
											res.status(400).send(Jobj);
										}
										var userCnt = parseInt(rows[0].usersCount);
										//console.log("Collaborators Number:"+userCnt);
										if(userCnt==1){
											role="collaborator";
										}
										if(role!=="nothing"){
											var userInfo = [{"message" : "User Valid"},{"userRole" : role}];
											//var Jobj=JSON.parse(userInfo);
											res.status(200).send(userInfo);
										}
										else {
											var obj = '{"message": "User Not Valid"}';
											var Jobj=JSON.parse(obj);
											res.status(400).send(Jobj);
									    }	
									});
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