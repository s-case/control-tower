module.exports = function(app, passport) {
	
	var mysql = require('mysql');
	var dbconfig = require('../config/database');
	var connConstant = require('../config/ConnectConstant');
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
// Delete account =============================================================
// =============================================================================
// used to delete accounts. 
	app.get('/delete/github', isLoggedIn, function(req, res) {
		var user = req.user;
		var user_id = req.param('user_id');
		//the query checks if the user owns a project
		var ownerflag;//flag to check if I am owner
		var CheckOwnershipQuery = " SELECT " + dbconfig.projects_table+".`project_name`, "+ dbconfig.owners_table+".`user_id` FROM "+ dbconfig.projects_table +
							" JOIN "+ dbconfig.owners_table+ " ON "+ dbconfig.projects_table + ".`project_id`="+dbconfig.owners_table+".`project_id` " +
								" WHERE " +dbconfig.owners_table+".`user_id`="+"'"+user.id+"'";//Query to select all the project names that the user owns
		connection=connConstant.connection;
		if(!user_id){
			connection.query(CheckOwnershipQuery, function(err, rows) {
	         	if (err) throw err;
	         	var newmessage;//we create the message that contains the projects that the user owns
				for(var i in rows){
					if(i==0){
						newmessage =rows[i].project_name + " and ";
					}
					else {
						newmessage =newmessage+rows[i].project_name + " and ";
					}
				}
				if(newmessage!=null){//we are going to insert this message in the DB, in order to know that the user attempted to delete the profile
					newmessage = newmessage.substring(0,newmessage.length-4);
					connection=connConstant.connection;
					var selectUsersQuery = "SELECT * FROM " + dbconfig.users_table + " WHERE id = '" + user.id + "'";
					connection.query(selectUsersQuery, function(err, rows){
	                    if (err)
	                        return done(err);
	                    if (rows.length > 0) {
	                        var userProfile = rows[0];
	                        userProfile.Message=newmessage;
                            var updateQuery = "UPDATE " + dbconfig.users_table + " SET " +
                                "`message` = '" + userProfile.Message + "' " +
                                "WHERE `id` = '" + user.id + "' LIMIT 1";//query to insert the alert message in the user's profile in the db
                            connection=connConstant.connection;
                            connection.query(updateQuery, function(err, rows) {
                            	res.redirect('/profile');
                            });
	                    }
					});
				}	
				if(!rows[0]){//if the user does not own any project we are going to delete the account
					res.redirect('/delete/github?user_id='+user.id);
				}
			});
		}
		if(user_id){
            //delete any project I am the only owner (the only large SQL statement)
        	var DeleteProjectsOnlyOwnerQuery = "DELETE FROM " + dbconfig.projects_table + 
        		" WHERE " + dbconfig.projects_table + ".project_id IN (SELECT project_id "+
	        	"FROM (SELECT * FROM " + dbconfig.owners_table + 
	        	" WHERE " +dbconfig.owners_table +".project_id IN (SELECT project_id FROM " +
	        	dbconfig.owners_table + " WHERE "+ dbconfig.owners_table + ".user_id=" + user_id +
	        	")) AS projectsofuser GROUP BY project_id HAVING COUNT(project_id)=1)";
			console.log(DeleteProjectsOnlyOwnerQuery);
            connection=connConstant.connection;
            connection.query(DeleteProjectsOnlyOwnerQuery, function(err, rows) {
                //delete from owners
				var DeleteFromOwnerQuery = "DELETE FROM " + dbconfig.owners_table +                          
	                                " WHERE `user_id` = " + user_id;
                console.log(DeleteFromOwnerQuery);
                connection=connConstant.connection;
                connection.query(DeleteFromOwnerQuery, function(err, rows) {
            		var DeleteFromCollabQuery = "DELETE FROM " + dbconfig.collaborators_table +                          
                                " WHERE `user_id` = " + user_id;
                    console.log(DeleteFromCollabQuery);
                    connection=connConstant.connection;
                    connection.query(DeleteFromCollabQuery, function(err, rows) {
                    	var DeleteFromUsersQuery = "DELETE FROM " + dbconfig.users_table +                          
                			" WHERE `id` = " + user_id;
            			console.log(DeleteFromUsersQuery);
    				  	connection.query(DeleteFromUsersQuery, function(err, rows) {
                            	res.redirect('/'); 
                        });
                    });
                });
        	});

		}
	});
};
// route middleware to ensure user is logged i
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();

	res.redirect('/');
}