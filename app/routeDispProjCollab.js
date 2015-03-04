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
	// Display Projects I collaborate ==============================================
	// =============================================================================
	app.get('/displayCollabprojects/github', isLoggedIn, function(req, res) {
		var user = req.user;
		var proj_name = req.project_name;
		connection=connConstant.connection;
		var selectProjectCollab = "SELECT `project_name` FROM " + dbconfig.projects_table +" JOIN " + dbconfig.collaborators_table + " ON "+ dbconfig.projects_table+
			".`project_id` = "+ dbconfig.collaborators_table + ".`project_id` "+" WHERE "+ dbconfig.collaborators_table+".`user_id` = '" + user.id + "'";
		connection.query(selectProjectCollab, function(err, rows){
                if (rows.length > 0) {//if there are projects I collaborate I show them
                	res.render('projectsCollab.ejs', {
						projectnames : rows,
						user : user
					});
                }
                else{
                	res.redirect('/profile');
                }//otherwise I do not show anything
                
        });

	});
};
// route middleware to ensure user is logged i
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();

	res.redirect('/');
}
