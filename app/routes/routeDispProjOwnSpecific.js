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

	// ====================================================================================================================
	// Project panel of a Project I own. Display other owners, collaborators (allow to remove them only if I own a project)
	// ====================================================================================================================

	app.get('/manageprojects', isLoggedIn, function(req, res) {
		var user = req.user;
		var proj_name = req.param('project_name');//name of the project to manage
		if(proj_name){
			//flag that is going to be set to true only if own the project
			//function to check if I own the project
			checkIfOwner(user,proj_name,function(ownerflag){
				if(ownerflag==true){
					//console.log('i m in');
					var owners;//it is going to include all the owners (names and ids)
					var collaborators;//it is going to include all the collaborators (names and ids)
					var privacy_level;
					//function to get all the owners
					function displayOwners (callback){
						//query to select all owners
						var selectOwnersQuery = "SELECT `github_name`,`google_email`,"+dbconfig.projects_table+".`project_id`," + dbconfig.owners_table + ".id AS owner_id FROM "  + dbconfig.users_table +" JOIN " + dbconfig.owners_table + 
						" ON "+ dbconfig.users_table + ".id=" +  dbconfig.owners_table+".user_id "+ "JOIN "+ dbconfig.projects_table+
						" ON "+ dbconfig.projects_table + ".project_id=" + dbconfig.owners_table + ".project_id" + 
						" WHERE " + dbconfig.projects_table + ".project_name=" + "'" + proj_name + "'";
						connection=connConstant.connection;
						connection.query(selectOwnersQuery, function(err, rows){
		                    if (rows.length > 0) {
		                    	owners=rows;
		                    }
		                    callback();
			            });
					}
					//function to get all the collaborators
					function displayCollaborators (callback){
						//query to select all collaborators
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
		                    callback();//callback at the end of the second query
		        		});
					}
					//function to get the privacy level, the domain and the subdomain
					function getPrivacyDomainSubdomain (callback){
						//query to select all collaborators
						var getProjectDetails = "SELECT `privacy_level`,`domain`,`subdomain` FROM " + dbconfig.projects_table + " WHERE project_name="+ "'"
								+ proj_name +"'";//query to get the project's
						connection.query(getProjectDetails, function(err, rows){
							privacy_level='private';
							if(rows.length>0){
								privacy_level=rows[0].privacy_level;
								domain_set = rows[0].domain;
								subdomain_set = rows[0].subdomain;
								console.log(privacy_level+":"+domain_set+":"+subdomain_set);
				                callback();//callback at the end of the query
							}
							else{
								res.redirect('/manageprojects'+'?project_name='+proj_name);
							}
						});	 
					}
					displayOwners(function(){
						//console.log("owners"+owners);
						displayCollaborators(function(){
							getPrivacyDomainSubdomain (function(){
								res.render('projectSpecific.ejs', {
									privacylevel:privacy_level,//the level of privacy
									ownersnames : owners,//we return owners
									collaboratorsnames : collaborators,//we return collaborators
									projectname : proj_name,//we return project name
									username : user.github_name,//we return the active's User name (it is used in order be able to remove your own account from the project)
									user: user,
									domainset: domain_set,
									subdomainset: subdomain_set
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
