module.exports = function(app, passport) {
	
	var mysql = require('mysql');
	var dbconfig = require('../../config/database');
	var connConstant = require('../../config/ConnectConstant');
	var connection;
	// =============================================================================
	// Display Projects I collaborate ==============================================
	// =============================================================================
	app.get('/displayCollabprojects', isLoggedIn, function(req, res) {
		var user = req.user;
		connection=connConstant.connection;
		var selectProjectCollab = "SELECT `project_name` FROM " + dbconfig.projects_table +" JOIN " + dbconfig.collaborators_table + " ON "+ dbconfig.projects_table+
			".`project_id` = "+ dbconfig.collaborators_table + ".`project_id` "+" WHERE "+ dbconfig.collaborators_table+".`user_id` = '" + user.id + "'";//query to get the project the user collaborates on
		connection.query(selectProjectCollab, function(err, rows){
            	res.render('projectsCollab.ejs', {
					projectnames : rows,
					user : user
				});
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
