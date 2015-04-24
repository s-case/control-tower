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
	var project_name= req.param('project_name');//require project name
	var scase_signature = req.param('scase_signature');//require your scase_signature in order to authenticate
	if(scase_token && scase_signature && project_name){
		connection=connConstant.connection;
		connection.query('USE ' + dbconfig.database);
		//query to get the secret of the user
		var GetSecretQuery = "SELECT " + dbconfig.users_table + ".`scase_secret` AS scaseSecret WHERE " +
							dbconfig.users_table + ".`scase_token`= '"+ scase_token + "' ";
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
		res.setHeader('Content-Type', 'application/json');
		connection.query(GetSecretQuery,function(err,rows){
			if (err||rows.length==0){
				var obj = '{'
						+ '"userValid" : "false"'
						+ '}';
				var Jobj=JSON.parse(obj);
				res.send(Jobj);
			}
			var produced_signature=jwt.sign({ scasetoken : scase_token},rows[0].scaseSecret);
			if(scase_signature==produced_signature){
				connection.query(OwnerSelectQuery, function(err, rows){//check if the user is owner
					if (err||rows.length==0){
						var obj = '{'
								+ '"userValid" : "false"'
								+ '}';
						var Jobj=JSON.parse(obj);
						res.send(Jobj);
					}
					var userCnt = parseInt(rows[0].usersCount);
					//console.log("Owners Number:"+userCnt);
					if(userCnt==1){
						role="owner";
					}
					if(role!=="nothing"){
						var userInfo = [{"userValid" : "true"},{"userRole" : role}];
						//var Jobj=JSON.parse(userInfo);
						res.send(userInfo);
					}				
				});
				connection=connConstant.connection;
				connection.query(CollaboratorSelectQuery, function(err, rows){
					if (err||rows.length==0){
						var obj = '{'
								+ '"userValid" : "false"'
								+ '}';
						var Jobj=JSON.parse(obj);
						res.send(Jobj);
					}
					var userCnt = parseInt(rows[0].usersCount);
					//console.log("Collaborators Number:"+userCnt);
					if(userCnt==1){
						role="collaborator";
					}
					if(role!=="nothing"){
						var userInfo = [{"userValid" : "true"},{"userRole" : role}];
						//var Jobj=JSON.parse(userInfo);
						res.send(userInfo);
					}
					else {
						var userInfo = [{"userValid" : "false"},{"userRole" : role}];
						//var Jobj=JSON.parse(userInfo);
						res.send(userInfo);
				    }	
				});
			}
			else{
				var obj = '{'
						+ '"userValid" : "false"'
						+ '}';
				var Jobj=JSON.parse(obj);
				res.send(Jobj);
			}
		});
		
	}
	else if(scase_token&&scase_signature){//if we have sent only the scase_token and scase_signature we just check if the scase token exists in the database
		connection=connConstant.connection;
		connection.query('USE ' + dbconfig.database);
		//query to get the secret of the user
		var GetSecretQuery = "SELECT " + dbconfig.users_table + ".`scase_secret` AS scaseSecret WHERE " +
							dbconfig.users_table + ".`scase_token`= '"+ scase_token + "' ";
		var selectQuery = "SELECT COUNT(*) AS usersCount FROM " + dbconfig.users_table + " WHERE "+
							"`scase_token` = '" + scase_token + "' ";
		res.setHeader('Content-Type', 'application/json');
		connection.query(GetSecretQuery,function(err,rows){
			if (err||rows.length==0){
				var obj = '{'
						+ '"userValid" : "false"'
						+ '}';
				var Jobj=JSON.parse(obj);
				res.send(Jobj);
			}
		}
		var produced_signature=jwt.sign({ scasetoken : scase_token},rows[0].scaseSecret);
		if(scase_signature==produced_signature){
			connection.query(selectQuery, function(err, rows){
				if (err||rows.length==0){
					var obj = '{'
							+ '"userValid" : "false"'
							+ '}';
					var Jobj=JSON.parse(obj);
					res.send(Jobj);
				}
				
				var userCnt = parseInt(rows[0].usersCount);
				//console.log(userCnt);
				if(userCnt==1){
					var obj = '{'
							+ '"userValid" : "true"'
							+ '}';
					var Jobj=JSON.parse(obj);
					res.send(Jobj);
				}
				else {
					var obj = '{'
							+ '"userValid" : "false"'
							+ '}';
					var Jobj=JSON.parse(obj);
					res.send(Jobj);
				}
			});
		}
	}
	else{
		res.setHeader('Content-Type', 'application/json');
		var obj = '{'+ '"message": "you miss some parameters"}';
		var Jobj=JSON.parse(obj);
		res.send(Jobj);
	}
});
};