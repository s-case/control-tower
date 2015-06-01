module.exports = function(app, passport) {
	
	var mysql = require('mysql');
	var dbconfig = require('../../config/database');
	var connConstant = require('../../config/ConnectConstant');
	var connection;
	var http = require('http');
	var request = require('request');
	var ArtRepoURL = ArtRepoConfig.SCASEartRepo.URL;
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
	// ===============================================================
	// Create a Domain and Subdomain of aproject I own ========================================
	// ===============================================================
	app.get('/changeDomainSubdomain', isLoggedIn, function(req, res) {
		var user = req.user;
		var proj_name = req.param('project_name');//name of the project to manage
		var domain = req.param('domain');//the new domain of the project
		var subdomain = req.param('subdomain');//the new subdomain of the project
		checkIfOwner(user,proj_name,function(ownerflag){//we check if the user is owner of the project
			if(ownerflag==true){
				connection=connConstant.connection;//we update the connection to the mysql database
				var changePrivacyQuery = "UPDATE " +dbconfig.projects_table+ " SET `domain`='" +domain
					+ "' , `subdomain`= '"+subdomain+"' WHERE `project_name`='"+proj_name+"'";//the query to update the domain and subdomain
				connection.query(changePrivacyQuery, function(err, rows){//perform the query
					request(ArtRepoURL+'assetregistry/project', function (error, response, body){
						console.log(body);
					});
					res.redirect('/manageprojects'+'?project_name='+proj_name);
				});	
			}else{
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
