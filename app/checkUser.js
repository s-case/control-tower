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
	var scase_token=req.param('scase_token')
	if(scase_token){
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
    							res.send(obj);

							}
							else {
								res.setHeader('Content-Type', 'application/json');
                				var obj = '{'
                						+ '"userValid" : "false"'
                						+ '}';
    							res.send(obj);

							}
		});

	}
});
//app.use('/api',router);
};