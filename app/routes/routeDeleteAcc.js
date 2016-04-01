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
		//console.log(selectProjects)
		connection.query(selectProjects, function(err, rows){
			if (rows.length > 0) {
            	for(var i in rows){
        			if(rows[i].project_name==proj_name){
        				ownerflag=true;
        			}
            	}
	        }
	        //console.log(ownerflag);
	        callback(ownerflag);
		});
	}
// =============================================================================
// Delete account =============================================================
// =============================================================================
	app.get('/delete', isLoggedIn, function(req, res) {
		var user = req.user;
		var user_id = req.param('user_id');//the user id of the user to delete
		//the query checks if the user owns a project
		var ownerflag;//flag to check if I am owner
		//Query to select all the project names that the user owns
		var CheckOwnershipQuery = " SELECT " + dbconfig.projects_table+".`project_name`, "+ dbconfig.owners_table+".`user_id` FROM "+ dbconfig.projects_table +
							" JOIN "+ dbconfig.owners_table+ " ON "+ dbconfig.projects_table + ".`project_id`="+dbconfig.owners_table+".`project_id` " +
								" WHERE " +dbconfig.owners_table+".`user_id`="+"'"+user.id+"'";
		connection=connConstant.connection;
		if(!user_id){//at first we create a message with all the projects the user owns to alert about the potential deletion (the message is stored in the database and shown to the user)
			connection.query(CheckOwnershipQuery, function(err, rows) {
			 	if (err) throw err;
			 	var newmessage;//we create the message that contains the projects that the user owns
				
				for(var i in rows) {
					if(i==0) {
						newmessage = "\"" + rows[i].project_name + "\" , ";
					}
					else {
						newmessage = newmessage + "\"" + rows[i].project_name + "\" , ";
					}
				}
				
				if(newmessage != undefined && newmessage.length > 0) newmessage = newmessage.substring(0,newmessage.length-2);//remove the last "and"
				connection=connConstant.connection;
				
				var selectUsersQuery = "SELECT * FROM " + dbconfig.users_table + " WHERE id = '" + user.id + "'";
				connection.query(selectUsersQuery, function(err, rows) {
			            if (err){
			            	res.redirect('/profile');
			            }
		            	    if (rows.length > 0) {

		                	var userProfile = rows[0];
					userProfile.Message = newmessage;
	                    		var updateQuery = "UPDATE " + dbconfig.users_table + " SET " + "`message` = '" + userProfile.Message + "' " +
	                        "WHERE `id` = '" + user.id + "' LIMIT 1";//query to insert the alert message in the user's profile in the db
				    	connection=connConstant.connection;//get a new connection
				    	connection.query(updateQuery, function(err, rows) {
						res.render('profile.ejs', {
							user : userProfile,
							userMessageShow: true
						});
	                    		});
		            	    }
				});
	
				if(!rows[0]) {//if the user does not own any project we are going to delete the account
					res.redirect('/delete?user_id='+user.id);
				}
			});
		}
		if(user_id){//if the user id is specified then the user has already seen the message
            //delete any project I am the only owner (the only large SQL statement)
        	var DeleteProjectsOnlyOwnerQuery = "DELETE FROM " + dbconfig.projects_table + 
        		" WHERE " + dbconfig.projects_table + ".project_id IN (SELECT project_id "+
	        	"FROM (SELECT * FROM " + dbconfig.owners_table + 
	        	" WHERE " +dbconfig.owners_table +".project_id IN (SELECT project_id FROM " +
	        	dbconfig.owners_table + " WHERE "+ dbconfig.owners_table + ".user_id=" + user_id +
	        	")) AS projectsofuser GROUP BY project_id HAVING COUNT(project_id)=1)";
            connection=connConstant.connection;
            connection.query(DeleteProjectsOnlyOwnerQuery, function(err, rows) {
                //delete from owners
				var DeleteFromOwnerQuery = "DELETE FROM " + dbconfig.owners_table +                          
	                                " WHERE `user_id` = " + user_id;//we delete the user from the owners
                connection=connConstant.connection;
                connection.query(DeleteFromOwnerQuery, function(err, rows) {
            		var DeleteFromCollabQuery = "DELETE FROM " + dbconfig.collaborators_table +                          
                                " WHERE `user_id` = " + user_id;//we delete the user from the collaborators
                    connection=connConstant.connection;
                    connection.query(DeleteFromCollabQuery, function(err, rows) {
                    	var DeleteFromUsersQuery = "DELETE FROM " + dbconfig.users_table +                          
                			" WHERE `id` = " + user_id;//we delete the user from the users
    				  	connection.query(DeleteFromUsersQuery, function(err, rows) {
                            	res.redirect('/'); 
                        });
                    });
                });
        	});

		}
	});
};
// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
	var connConstant = require('../../config/ConnectConstant');
	var connection;
	connection = connConstant.connection;
	if (req.isAuthenticated())
		return next();

	res.redirect('/');
}
