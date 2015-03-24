module.exports = function(app, passport) {
	
	var mysql = require('mysql');
	var dbconfig = require('../../config/database');
	var connConstant = require('../../config/ConnectConstant');
	//var connection = mysql.createConnection(dbconfig.connection);
	//var connection = require('../config/ConnectConstant.js');
	var connection;

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
	var connConstant = require('../../config/ConnectConstant');
	var connection;
	connection = connConstant.connection;
	if (req.isAuthenticated())
		return next();

	res.redirect('/');
}
