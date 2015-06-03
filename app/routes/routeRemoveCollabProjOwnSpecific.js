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
		//console.log(selectProjects)
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
	// =============================================================================
	// Remove a Collaborator from a Project I own or If I want to remove myself ====
	// =============================================================================
	app.get('/removeCollab', isLoggedIn, function(req, res) {
		var user = req.user;
		var collab_id= req.param('collab_id');//collaborator's id
		var proj_name = req.param('project_name')
		var ownerflag;//flag to check if I am owner
		checkIfOwner(user,proj_name,function(ownerflag){
			if(ownerflag==true){
              var removeCollabQuery = "DELETE FROM " + dbconfig.collaborators_table+
				" WHERE " + dbconfig.collaborators_table + ".id=" + "'" + collab_id + "'";
				connection=connConstant.connection;
				connection.query(removeCollabQuery, function(err, rows){
	                    res.redirect('/manageprojects'+'?project_name='+proj_name);
                });
			}
			else{//check if I am a collaborator in the project, so I can remove myself!
				var getCollabInfo = "SELECT user_id FROM " + dbconfig.collaborators_table +
					" WHERE " + dbconfig.collaborators_table + ".id=" + "'" + collab_id + "'";
				connection=connConstant.connection;
				connection.query(getCollabInfo, function(err, rows){
						if(rows.length>0){
							if(rows[0].user_id==user.id){//if I am a collaborator in the project I can remove myself!
								 var removeCollabQuery = "DELETE FROM " + dbconfig.collaborators_table+
									" WHERE " + dbconfig.collaborators_table + ".id=" + "'" + collab_id + "'";
								connection=connConstant.connection;
								connection.query(removeCollabQuery, function(err, rows){
					                    res.redirect('/profile');
				                });
							}
						}
						else{
							res.redirect('/profile');
						}
                });
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
