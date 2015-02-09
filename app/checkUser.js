var role = "nothing";
module.exports = function(app){

var mysql = require('mysql');
var dbconfig = require('../config/database');
var connection = require('../config/ConnectConstant.js');

// ROUTES FOR OUR API
// =============================================================================
//var router = express.Router();
//route for the S-CASE tools that do not store data
//in order to check if a token is an S-CASE token

app.get('/api',function(req,res){
	var scase_token=req.param('scase_token');
	var project_name=req.param('project_name');
	if(scase_token && project_name){
		connection.query('USE ' + dbconfig.database);
		//check if the user is owner		
		var OwnerSelectQuery = "SELECT COUNT(*) AS usersCount FROM CTDB.users INNER JOIN (owners,projects) "+
							"ON users.`id`=owners.`user_id` " +
							"AND owners.`project_id`=projects.`project_id` "+
							"WHERE projects.`project_name`= '" + project_name + "' " +
							"AND users.`scase_token`= '" + scase_token + "' ";
		//check if the user is owner		
		var CollaboratorSelectQuery = "SELECT COUNT(*) AS usersCount FROM CTDB.users INNER JOIN (collaborators,projects) "+
							"ON users.`id`=collaborators.`user_id` " +
							"AND collaborators.`project_id`=projects.`project_id` "+
							"WHERE projects.`project_name`= '" + project_name + "' " +
							"AND users.`scase_token`= '" + scase_token + "' ";					
		var role = "nothing";
		res.setHeader('Content-Type', 'application/json');
		connection.query(OwnerSelectQuery, function(err, rows){
								if (err) throw err;
								
								var userCnt = parseInt(rows[0].usersCount);
								console.log("Owners Number:"+userCnt);
								if(userCnt==1){
									role="owner";
								}
								if(role!=="nothing"){
									var userInfo = [{"userValid" : "true"},{"userRole" : role}];             						+ ']';
									//var Jobj=JSON.parse(userInfo);
									res.send(userInfo);
								}
								/*else {
									res.setHeader('Content-Type', 'application/json');
									var userInfo = [{"userValid" : "false"},{"userRole" : role}];             						+ ']';
									//var Jobj=JSON.parse(userInfo);
									res.send(userInfo);
									
	    						}*/
								
		});
		
		
		connection.query(CollaboratorSelectQuery, function(err, rows){
							if (err) throw err;
							var userCnt = parseInt(rows[0].usersCount);
							console.log("Collaborators Number:"+userCnt);
							if(userCnt==1){
								role="collaborator";
							}
							if(role!=="nothing"){
								var userInfo = [{"userValid" : "true"},{"userRole" : role}];             						+ ']';
								//var Jobj=JSON.parse(userInfo);
								res.send(userInfo);
							}
							else {
								var userInfo = [{"userValid" : "false"},{"userRole" : role}];             						+ ']';
								//var Jobj=JSON.parse(userInfo);
								res.send(userInfo);
								
						    }
							
		});
	}
	else if(scase_token){
		connection.query('USE ' + dbconfig.database);
		var selectQuery = "SELECT COUNT(*) AS usersCount FROM CTDB.users WHERE "+
							"`scase_token` = '" + scase_token + "' ";
		connection.query(selectQuery, function(err, rows){
							if (err) throw err;
							
							var userCnt = parseInt(rows[0].usersCount);
							console.log(userCnt);
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


});
//app.use('/api',router);
};