module.exports = function(app, passport) {
	
	var mysql = require('mysql');
	var dbconfig = require('../../config/database');
	var connConstant = require('../../config/ConnectConstant');
	//var connection = mysql.createConnection(dbconfig.connection);
	//var connection = require('../config/ConnectConstant.js');
	var connection;
	
	var ownerflag;//flag used to check if the user is an owner
	//function to check if the user is owner of a specific project
	function checkIfOwner(user,proj_name,callback){
		connection=connConstant.connection;
		var selectProjects = "SELECT `project_name` FROM " + dbconfig.projects_table +" JOIN " + dbconfig.owners_table + " ON "+ dbconfig.projects_table+
		".`project_id` = "+ dbconfig.owners_table + ".`project_id` "+" WHERE "+ dbconfig.owners_table+".`user_id` = '" + user.id + "'";
		console.log(selectProjects)
		connection.query(selectProjects, function(err, rows){
			if (rows.length > 0) {
            	for(var i in rows){
        			if(rows[i].project_name==proj_name){
        				ownerflag=true;
        			}
            	}
	        }
	        console.log(ownerflag);
	        callback(ownerflag);
		});
	}
	// =============================================================================
	// Remove an Owner from a Project I own ========================================
	// =============================================================================
	app.get('/removeOwner/github', isLoggedIn, function(req, res) {
		var user = req.user;
		var owner_id= req.param('owner_id');
		var proj_name = req.param('project_name')
		var proj_id = req.param('project_id');
		var ownerflag;//flag to check if I am owner
		checkIfOwner(user,proj_name,function(ownerflag){
			if(ownerflag==true){
				var checkOwnersAmountQuery = "SELECT * FROM " + dbconfig.owners_table + " WHERE "+ dbconfig.owners_table + ".project_id="+"'"+proj_id+"'";
				console.log(checkOwnersAmountQuery);
				connection=connConstant.connection;
				connection.query(checkOwnersAmountQuery, function(err, rows){
						//if there are more than 1 owners, I just remove the owner
						if(rows.length>1){
							var removeOwnerQuery = "DELETE FROM " + dbconfig.owners_table+
							" WHERE " + dbconfig.owners_table + ".id=" + "'" + owner_id + "'";
							console.log(removeOwnerQuery);
							connection=connConstant.connection;
							connection.query(removeOwnerQuery, function(err, rows){
								res.redirect('/manageprojects/github'+'?project_name='+proj_name);
							});
						}//if there is only 1 owner, I delete the whole project
						else{
							res.redirect('/deleteprojects/github'+'?project_name='+proj_name);
						}
	                    
                }); 
                
			}
		});	
		
	});
};
// route middleware to ensure user is logged i
function isLoggedIn(req, res, next) {
	var connConstant = require('../../config/ConnectConstant');
	var connection;
	connection = connConstant.connection;
	if (req.isAuthenticated())
		return next();

	res.redirect('/');
}
