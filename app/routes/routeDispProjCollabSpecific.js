module.exports = function(app, passport) {
	
	var mysql = require('mysql');
	var dbconfig = require('../../config/database');
	var connConstant = require('../../config/ConnectConstant');
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
	        callback(ownerflag);
		});
	}

	// ============================================================================================================================================
	// Project panel of a Project I collaborate, along with the other owners and collaborators ====================================================
	// ============================================================================================================================================
	app.get('/collabprojects', isLoggedIn, function(req, res) {
		var user = req.user;
		var proj_name = req.param('project_name');//name of the project to manage
		if(proj_name){
			var collabflag;//flag to see if the user is collaborator
			function checkIfCollab(callback){
				var flag;
				connection=connConstant.connection;
				//check if I collaborate in a project
				connection.query("SELECT `project_name` FROM " + dbconfig.projects_table +" JOIN " + dbconfig.collaborators_table + " ON "+ dbconfig.projects_table+
				".`project_id` = "+ dbconfig.collaborators_table + ".`project_id` "+" WHERE "+ dbconfig.collaborators_table+".`user_id` = '" + user.id + "'", function(err, rows){
					if (rows.length > 0) {
	                    	for(var i in rows){
                    			if(rows[i].project_name==proj_name){
                    				collabflag=true;
                    			}
	                    	}
                    }
                    callback(collabflag);
        		});
			}
			checkIfCollab(function(collabflag){
				if(collabflag==true){
					var owners;//variable to display owners
					var collaborators;//variable to display collaborators
					//function to get all the owners of the project I collaborate on
					function displayOwners (callback){
						var selectOwnersQuery = "SELECT `github_name`,`google_email` FROM " + dbconfig.users_table +" JOIN " + dbconfig.owners_table + 
						" ON "+ dbconfig.users_table + ".id=" +  dbconfig.owners_table+".user_id "+ "JOIN "+ dbconfig.projects_table+
						" ON "+ dbconfig.projects_table + ".project_id=" + dbconfig.owners_table + ".project_id" + 
						" WHERE " + dbconfig.projects_table + ".project_name=" + "'" + proj_name + "'";
						connection=connConstant.connection;
						connection.query(selectOwnersQuery, function(err, rows){
		                    if (rows.length > 0) {
		                    	owners=rows;
		                    }
		                    callback(owners);
			            });
					}
					//function to get all the collaborators of the project I collaborate on
					function displayCollaborators (callback){
		        		var selectCollaboratorsQuery = "SELECT `github_name`,`google_email`," + dbconfig.collaborators_table + ".id AS `collab_id` FROM " + dbconfig.users_table +" JOIN " + dbconfig.collaborators_table + 
						" ON "+ dbconfig.users_table + ".id=" +  dbconfig.collaborators_table+".user_id "+ "JOIN "+ dbconfig.projects_table+
						" ON "+ dbconfig.projects_table + ".project_id=" + dbconfig.collaborators_table + ".project_id" + 
						" WHERE " + dbconfig.projects_table + ".project_name=" + "'" + proj_name + "'";
						connection=connConstant.connection;
		        		connection.query(selectCollaboratorsQuery, function(err, rows){
		                    if (rows.length > 0) {
		                    	collaborators=rows;
		                    }
		                    callback(collaborators);
		        		});
					}
					//function to get the domain and subdomain and the privacy level
					function getPrivacyDomainSubdomain (callback){
						//query to select all collaborators
						var getProjectDetails = "SELECT `privacy_level`,`domain`,`subdomain` FROM " + dbconfig.projects_table + " WHERE project_name="+ "'"
								+ proj_name +"'";//query to get the project's
						connection.query(getProjectDetails, function(err, rows){
							privacy_level='private';
							if(rows.length>0){
								privacy_level=rows[0].privacy_level;
								domain = rows[0].domain;
								subdomain = rows[0].subdomain;
				                callback();//callback at the end of the query
							}
							else{
								res.redirect('/manageprojects'+'?project_name='+proj_name);
							}
						});	 
					}
					displayOwners(function(){
						displayCollaborators(function(){
							getPrivacyDomainSubdomain  (function(){
								res.render('projectSpecific.ejs', {
									privacylevel:privacy_level,//the level of privacy
									ownersnames : owners,//we return owners
									collaboratorsnames : collaborators,//we return collaborators
									projectname : proj_name,//we return project name
									username : user.github_name,//we return the active's User name (it is used in order be able to remove your own account from the project)
									user: user,
									domain: domain,
									subdomain: subdomain
								});
							});
						});
					});
				}
			});	
		}
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
