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
	// ===============================================================
	// Create a Project I own ========================================
	// ===============================================================
	app.get('/changePrivacy', isLoggedIn, function(req, res) {
		var user = req.user;
		var proj_name = req.param('project_name');//name of the project to manage
		//console.log('projectname to create'+proj_name);
		var privacy = req.param('privacy_level');//the privacy level (private or public)
		checkIfOwner(user,proj_name,function(ownerflag){//we check if the user is owner
			if(ownerflag==true){
				var changePrivacyQuery = "UPDATE " +dbconfig.projects_table+ " SET `privacy_level`='" +privacy
					+ "' WHERE `project_name`='"+proj_name+"'";//the query to update the privacy level
				connection=connConstant.connection;//we get a new connection to the database
				connection.query(changePrivacyQuery, function(err, rows){
					//request to change the privacy in the project in the Assets Registry
					//first we get the whole json project and then we perform another request to send the project with its new privacy
					request(ArtRepoURL+'assetregistry/project/'+proj_name, function (error, response, body){
						var projectData = JSON.parse(body);
						projectData.privacyLevel=privacy;
						request({
							url: ArtRepoURL+'assetregistry/project/'+projectData.id,
							method:'PUT',
							json : projectData
						},function(error,response){
							console.log(response);
							res.redirect('/manageprojects'+'?project_name='+proj_name);
						});
					});
				});		
			}
			else{
				res.redirect('/manageprojects'+'?project_name='+proj_name);
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
