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
	        //onsole.log(ownerflag);
	        callback(ownerflag);
		});
	}

	// ============================================================================================================================================
	// Project panel of a Project I collaborate, along with the other owners and collaborators ====================================================
	// ============================================================================================================================================

	// github -------------------------------
	app.get('/collabprojects', isLoggedIn, function(req, res) {
		var user = req.user;
		var proj_name = req.param('project_name');//name of the project to manage
		if(proj_name){
			var collabflag;
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
					
					function displayOwners (callback){
						var selectOwnersQuery = "SELECT `github_name`,`google_email` FROM " + dbconfig.users_table +" JOIN " + dbconfig.owners_table + 
						" ON "+ dbconfig.users_table + ".id=" +  dbconfig.owners_table+".user_id "+ "JOIN "+ dbconfig.projects_table+
						" ON "+ dbconfig.projects_table + ".project_id=" + dbconfig.owners_table + ".project_id" + 
						" WHERE " + dbconfig.projects_table + ".project_name=" + "'" + proj_name + "'";
						connection=connConstant.connection;
						connection.query(selectOwnersQuery, function(err, rows){
			                    if (rows.length > 0) {
			                    	//console.log(rows);
			                    	owners=rows;
			                    }
			                    callback(owners);
			            });
					}
					function displayCollaborators (callback){
		        		var selectCollaboratorsQuery = "SELECT `github_name`,`google_email`," + dbconfig.collaborators_table + ".id AS `collab_id` FROM " + dbconfig.users_table +" JOIN " + dbconfig.collaborators_table + 
						" ON "+ dbconfig.users_table + ".id=" +  dbconfig.collaborators_table+".user_id "+ "JOIN "+ dbconfig.projects_table+
						" ON "+ dbconfig.projects_table + ".project_id=" + dbconfig.collaborators_table + ".project_id" + 
						" WHERE " + dbconfig.projects_table + ".project_name=" + "'" + proj_name + "'";
						connection=connConstant.connection;
						 
		        		connection.query(selectCollaboratorsQuery, function(err, rows){
		                    if (rows.length > 0) {
		                    	//console.log(rows);
		                    	collaborators=rows;
		                    }
		                    callback(collaborators);
		        		});
					}
					function getPrivacy (callback){
						//query to select all collaborators
						var getProjectId = "SELECT project_id FROM " + dbconfig.projects_table + " WHERE project_name="+ "'"
								+ proj_name +"'";//query to get the project's
						connection.query(getProjectId, function(err, rows){
							if(rows.length>0){
								var getPrivacyQuery = "SELECT `privacy_level` FROM " + dbconfig.projects_table + 
								" WHERE " + dbconfig.projects_table + ".project_id=" + rows[0].project_id;
								connection=connConstant.connection;
				        		connection.query(getPrivacyQuery, function(err, rows){
				        			privacy_level='private';
				                    if (rows.length > 0) {
				                    	//console.log(rows);
				                    	privacy_level=rows[0].privacy_level;
				                    }
				                    callback();//callback at the end of the second query
				        		});
							}
							else{
								res.redirect('/manageprojects'+'?project_name='+proj_name);
							}
						});	 
					}
					function getPrivacyDomaionSubdomain (callback){
						//query to select all collaborators
						var getProjectDetails = "SELECT project_id,domain,subdomain FROM " + dbconfig.projects_table + " WHERE project_name="+ "'"
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
						//console.log("owners"+owners);
						//console.log("collabs"+collaborators);
						displayCollaborators(function(){
						//console.log("collabs"+collaborators);
							getPrivacyDomaionSubdomain  (function(){
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
