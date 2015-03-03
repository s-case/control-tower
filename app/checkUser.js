var role = "nothing";
module.exports = function(app){

var mysql = require('mysql');
var dbconfig = require('../config/database');
var connection;
function handleDisconnect() {
  connection = mysql.createConnection(dbconfig.connection); // Recreate the connection, since
                                                  // the old one cannot be reused.

  connection.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 10000); // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
                                          // If you're also serving http, display a 503 error.
  connection.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}
// ROUTES FOR OUR API
// =============================================================================
//route for the S-CASE tools that do not store data
//in order to check if a token is an S-CASE token

app.get('/api/validateUser',function(req,res){
	var scase_token=req.param('scase_token');
	var project_name=req.param('project_name');
	if(scase_token && project_name){
		handleDisconnect();
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
				var userInfo = [{"userValid" : "true"},{"userRole" : role}];             						//+ ']';
				//var Jobj=JSON.parse(userInfo);
				res.send(userInfo);
			}				
		});
		handleDisconnect();
		connection.query(CollaboratorSelectQuery, function(err, rows){
			if (err) throw err;
			var userCnt = parseInt(rows[0].usersCount);
			console.log("Collaborators Number:"+userCnt);
			if(userCnt==1){
				role="collaborator";
			}
			if(role!=="nothing"){
				var userInfo = [{"userValid" : "true"},{"userRole" : role}];             						//+ ']';
				//var Jobj=JSON.parse(userInfo);
				res.send(userInfo);
			}
			else {
				var userInfo = [{"userValid" : "false"},{"userRole" : role}];             						//+ ']';
				//var Jobj=JSON.parse(userInfo);
				res.send(userInfo);
				
		    }
							
		});
	}
	else if(scase_token){
		handleDisconnect();
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
};