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
	        console.log(ownerflag);
	        callback(ownerflag);
		});
	}
	// ===============================================================
	// get the domain and subdomain of a Project I own ========================================
	// ===============================================================
	app.get('/getDomainSubdomain', isLoggedIn, function(req, res) {
		var user = req.user;
		var proj_name = req.param('project_name');//name of the project to get domain and subdomain
		res.setHeader('Content-Type', 'application/json');
		checkIfOwner(user,proj_name,function(ownerflag){
				if(ownerflag==true){
					connection=connConstant.connection;//get a new connection
					var getProjectDomainSubdomainQuery= "SELECT `domain`,`subdomain` FROM " + dbconfig.projects_table + " WHERE `project_name`="+ "'"
								+ proj_name +"'";//query to get the project's ID 
					connection.query(getProjectDomainSubdomainQuery, function(err, rows){
						if(rows.length>0){
							var projectDomainSubdomain = [{Category : rows[0].domain},{Category : rows[0].subdomain}];							
							res.status(200).send(projectDomainSubdomain);
						}
						else{//we return empty domain and subdomain
							var domainset;
							var subdomainset;
							var projectDomainSubdomain = [{domain : domainset },{subdomain : subdomainset}]; 
							res.status(500).send(projectDomainSubdomain);
						}
					});			
				}
				else{//we return empty domain and subdomain
					var domainset;
					var subdomainset;
					var projectDomainSubdomain = [{domain : domainset },{subdomain : subdomainset}];
					res.status(500).send(projectDomainSubdomain);
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
