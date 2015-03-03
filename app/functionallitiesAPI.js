var role = "nothing";
module.exports = function(app){

var mysql = require('mysql');
var dbconfig = require('../config/database');
var connection;
function handleDisconnect() {
  connection = mysql.createConnection(dbconfig.connection); // Recreate the connection, since the old one cannot be reused.

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
  connection.query('USE ' + dbconfig.database);
}
// ROUTES FOR OUR API
// =============================================================================
	//route to delete a User
	app.get('/api/deleteUser',function(req,res){
		var scase_token=req.param('scase_token');
		if(scase_token){
			handleDisconnect();
			var selectUsersQuery = "SELECT * FROM " + dbconfig.users_table + " WHERE scase_token = '" + scase_token + "'";
				connection.query(selectUsersQuery, function(err, rows){
				   	if (err)
                        return done(err);
                    if (rows.length > 0) {
                    	var userProfile = rows[0];
                    	res.redirect('/delete/github?user_id='+userProfile.id+"&api=true");
                    }
			});
		}
	});
	//route to delete a User
	app.get('/api/blabla',function(req,res){
		var scase_token=req.param('scase_token');
		if(scase_token){
			handleDisconnect();
			var selectUsersQuery = "SELECT * FROM " + dbconfig.users_table + " WHERE id = '" + user.id + "'";
				connection.query(selectUsersQuery, function(err, rows){
				   	if (err)
                        return done(err);
                    if (rows.length > 0) {
                    	var userProfile = rows[0];
                    	res.redirect('delete/github?user_id='+userProfile.id);
                    }
			});
		}
	});
};