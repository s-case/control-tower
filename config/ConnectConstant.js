var mysql = require('mysql');
var dbconfig = require('../config/database');
var connection; 
//function to handle the disconnections to the Mysql database
function handleDisconnect(connection) {
  connection = mysql.createConnection(dbconfig.connection); // Recreate the connection, since
  connection.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 10000); // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.                                          // If you're also serving http, display a 503 error.
  connection.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') {
      connection.end(); // Connection to the MySQL server is usually
      connection = mysql.createConnection(dbconfig.connection);
      handleDisconnect(connection);                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
  connection.query('USE ' + dbconfig.database);
  console.log('I connected to the DB!!');
  module.exports.connection =connection;
};
handleDisconnect(connection);

