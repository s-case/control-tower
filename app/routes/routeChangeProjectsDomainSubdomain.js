module.exports = function(app, passport) {
	
	var mysql = require('mysql');
	var dbconfig = require('../../config/database');
	var connConstant = require('../../config/ConnectConstant');
	var connection;
	var ArtRepoConfig = require('../../config/ArtRepo'); //get the artefact repo url
	var http = require('http');
	var request = require('request');
	var ArtRepoURL = ArtRepoConfig.SCASEartRepo.URL;
	var ownerflag;//flag used to check if the user is an owner
	//function to check if the user is owner of a specific project
	function checkIfOwner(user,proj_name,callback){
		connection=connConstant.connection;//we update the connection to mysql
		var selectProjects = "SELECT `project_name` FROM " + dbconfig.projects_table +" JOIN " + dbconfig.owners_table + " ON "+ dbconfig.projects_table+
		".`project_id` = "+ dbconfig.owners_table + ".`project_id` "+" WHERE "+ dbconfig.owners_table+".`user_id` = '" + user.id + "'";
		//the above query gets all the project names of the projects that the user owns
		connection.query(selectProjects, function(err, rows){
			if (rows.length > 0) {//if we have results (meaning project names)
            	for(var i in rows){
        			if(rows[i].project_name==proj_name){//if we find a project name that equals to the project we attempt to change we set the ownerflag to true
        				ownerflag=true;
        			}
            	}
	        }
	        callback(ownerflag);
		});
	}
	// ===============================================================
	// Create a Domain and Subdomain of aproject I own ========================================
	// ===============================================================
	app.get('/changeDomainSubdomain', isLoggedIn, function(req, res) {
		var user = req.user;
		var proj_name = req.param('project_name');//name of the project to manage
		var domain = req.param('domain');//the new domain of the project
		var subdomain = req.param('subdomain');//the new subdomain of the project
		checkIfOwner(user,proj_name,function(ownerflag){//we check if the user is owner of the project
			if(ownerflag==true){//if the user is owner we continue
				connection=connConstant.connection;//we update the connection to the mysql database
				var changeDomainSubdomain= "UPDATE " +dbconfig.projects_table+ " SET `domain`='" +domain
					+ "' , `subdomain`= '"+subdomain+"' WHERE `project_name`='"+proj_name+"'";//the query to update the domain and subdomain
				connection.query(changeDomainSubdomain, function(err, rows){//perform the query to update domain and subdomain
					//first we perform a request to get the project JSON document from the ASSET registry
					request(ArtRepoURL+'assetregistry/project/'+proj_name, function (error, response, body){
						//request to change the domain in the project in the Assets Registry
						var projectData = JSON.parse(body);//we parse the document as JSON
						projectData.domain=domain//insert the new domain
						projectData.subdomain=subdomain//insert the new subdomain
						//request to PUT the new project JSON document back to the ASSET registry
						request({
							url: ArtRepoURL+'assetregistry/project/'+projectData.id,
							method:'PUT',
							json : projectData
						},function(error,response){
							//================TBD==========================================================================================
							//code that checks the response code to be added when the response codes are introduced in the Assets Registry
							//=============================================================================================================
							res.redirect('/manageprojects'+'?project_name='+proj_name);
						});
					});
					
				});	
			}else{//if the user is not owner we do not change the domain and subdomain
				res.redirect('/manageprojects'+'?project_name='+proj_name);
			}
		});		
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
