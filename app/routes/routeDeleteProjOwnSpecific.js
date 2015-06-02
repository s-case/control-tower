module.exports = function(app, passport) {
	
	var mysql = require('mysql');
	var dbconfig = require('../../config/database');
	var connConstant = require('../../config/ConnectConstant');
	var ArtRepoConfig = require('../../config/ArtRepo'); // get the artefact repo url
	var http = require('http');
	var request = require('request');
	var ArtRepoURL = ArtRepoConfig.SCASEartRepo.URL;
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
	        console.log(ownerflag);
	        callback(ownerflag);
		});
	}
	// =============================================================================
	// Delete a Project I own ======================================================
	// delete it from all the other owners and collaborators too
	// =============================================================================
	app.get('/deleteprojects', isLoggedIn, function(req, res) {
		var user = req.user;
		var proj_name = req.param('project_name');//name of the project to delete
		var proj_id = req.param('project_id');//id of the project
		if(proj_name){
			var ownerflag;
			checkIfOwner(user,proj_name,function(ownerflag){
				if(ownerflag==true){
					var deleteProjectQuery = "DELETE FROM " + dbconfig.projects_table+
						" WHERE " + dbconfig.projects_table + ".project_name=" + "'" + proj_name + "'";//the query to delete the project
					//console.log(deleteProjectQuery);
					connection=connConstant.connection;//get a new connection to the DB
					connection.query(deleteProjectQuery, function(err, rows){
						//first get the project JSON and then delete the project using its id in the Art Registry
						request(ArtRepoURL+'assetregistry/project/'+proj_name, function (error, response, body){
							var projectData = JSON.parse(body);
							console.log(projectData);
							request.del(ArtRepoURL+'assetregistry/project/'+projectData.id,function(error,response){
								console.log(response);
								res.redirect('/displayOwnprojects');
							});
						}); 
	                });
				}
			});	
		}
		else{
			res.redirect('/displayOwnprojects');
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
