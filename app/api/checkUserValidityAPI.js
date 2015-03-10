var role = "nothing";
module.exports = function(app){

var mysql = require('mysql');
var dbconfig = require('../../config/database');
var connConstant = require('../../config/ConnectConstant');
var connection;
// ROUTES FOR OUR API
// =============================================================================
//route for the S-CASE tools that do not store data
//in order to check if a token is an S-CASE token

app.get('/api/validateUser',function(req,res){
	var scase_token= req.param('scase_token');//require your scase token in order to authenticate
	var project_name= req.param('project_name');//require project name
	if(scase_token && project_name){
		connection=connConstant.connection;
		connection.query('USE ' + dbconfig.database);
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
		connection.query(OwnerSelectQuery, function(err, rows){//check if the user is owner
			if (err||rows.length==0){
				res.setHeader('Content-Type', 'application/json');
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
				res.setHeader('Content-Type', 'application/json');
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
	else if(scase_token){//if we have sent only the scase_token we just check if the scase token exists in the database
		connection=connConstant.connection;
		connection.query('USE ' + dbconfig.database);
		var selectQuery = "SELECT COUNT(*) AS usersCount FROM " + dbconfig.users_table + " WHERE "+
							"`scase_token` = '" + scase_token + "' ";
		connection.query(selectQuery, function(err, rows){
			if (err||rows.length==0){
				res.setHeader('Content-Type', 'application/json');
				var obj = '{'
						+ '"userValid" : "false"'
						+ '}';
				var Jobj=JSON.parse(obj);
				res.send(Jobj);
			}
			
			var userCnt = parseInt(rows[0].usersCount);
			//console.log(userCnt);
			if(userCnt==1){
				res.setHeader('Content-Type', 'application/json');
				var obj = '{'
						+ '"userValid" : "true"'
						+ '}';
				var Jobj=JSON.parse(obj);
				res.send(Jobj);
			}
			else {
				res.setHeader('Content-Type', 'application/json');
				var obj = '{'
						+ '"userValid" : "false"'
						+ '}';
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