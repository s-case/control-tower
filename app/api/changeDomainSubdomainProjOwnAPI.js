var role = "nothing";
module.exports = function(app){
	var mysql = require('mysql');//it loads the mysql package
	var dbconfig = require('../../config/database');//it loads the configuration of the database
	var connConstant = require('../../config/ConnectConstant');//it loads a module that ensure continuous connection to the database
	var connection;//variable used for the connection to the database
	var ownerflag=false;//flag used to check if the user is an owner
	var jwt = require('jsonwebtoken');
	var ArtRepoConfig = require('../../config/ArtRepo'); // get the artefact repo url
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
	// =============================================================================
	// Create a project I own API===================================
	// =============================================================================
	app.post('/api/changeDomainSubdomainProjOwn', function(req, res) {
		res.setHeader('Content-Type', 'application/json');
		var scase_token= req.param('scase_token');//require your scase token in order to authenticate
		var scase_signature = req.param('scase_signature');//require your scase_signature in order to authenticate
		var proj_name= req.param('project_name');//require project name
		var domain = req.param('domain');//the new domain of the project
		var subdomain = req.param('subdomain');//the new subdomain of the project
		if(scase_token&&proj_name&&scase_signature){
			connection=connConstant.connection;//ensure that there is a connection to the DB
			//we select the user with the scase_token provided 
			var selectUsersQuery = "SELECT * FROM " + dbconfig.users_table + " WHERE scase_token = '" + scase_token + "'";//query to get all the info of the user with the provided scase token
			connection.query(selectUsersQuery, function(err, rows){
                if (rows.length > 0) {
                	jwt.verify(scase_signature,rows[0].scase_secret,function(err,decoded){
                		if(err){
							var obj = '{"message": "User with this scase_signature does not exist in S-Case"}';
							var Jobj=JSON.parse(obj);
							res.status(404).send(Jobj);
                		}
                		if(decoded){
							if(decoded.scasetoken==scase_token){//we check if the produced signature is the same with the one provided
		                		var user = rows[0];
								//console.log(createProjectQuery);
								connection=connConstant.connection;
								ownerflag=false;
								checkIfOwner(user,proj_name,function(ownerflag){
										if(ownerflag==true){
											connection=connConstant.connection;
											var getProjectId = "SELECT project_id FROM " + dbconfig.projects_table + " WHERE project_name="+ "'"
														+ proj_name +"'";//query to get the project's ID 
											//console.log(getProjectId);
											connection.query(getProjectId, function(err, rows){
												if(rows.length>0){
													var changeDomainSubdomain= "UPDATE " +dbconfig.projects_table+ " SET `domain`='" +domain
														+ "' , `subdomain`= '"+subdomain+"' WHERE `project_name`='"+proj_name+"'";//the query to update the domain and subdomain
													connection=connConstant.connection;
													//console.log(changePrivacyQuery);
													connection.query(changeDomainSubdomain, function(err, rows){
														//first we get the json of the project and then we do a put request to insert the project with its new privacyLevel value
														request(ArtRepoURL+'assetregistry/project/'+proj_name, function (error, response, body){
															var projectData = JSON.parse(body);
															projectData.domain=domain//insert the new domain
															projectData.subdomain=subdomain//insert the new subdomain
															request({
																url: ArtRepoURL+'assetregistry/project/'+projectData.id,
																method:'PUT',
																json : projectData
															},function(error,response){
																//================TBD==========================================================================================
																//code that checks the response code to be added when the response codes are introduced in the Assets Registry
																//=============================================================================================================
																var obj = '{"message": "Domain and subdomain of ' + proj_name +' set"}';
																var Jobj=JSON.parse(obj);
																res.status(200).send(Jobj);
															});
														});
													});
												}
												else{
													var obj = '{"message": "There is no project with name '+proj_name + '"}';
													var Jobj=JSON.parse(obj);
													res.status(404).send(Jobj);
												}
											});			
										}
										else{
											var obj = '{"message": "User with this scase_signature is not owner of the project"}';
											var Jobj=JSON.parse(obj);
											res.status(401).send(Jobj);
										}

								});		
		                	}
		                	else{
								var obj = '{"message": "User with this scase_signature does not exist in S-Case"}';
								var Jobj=JSON.parse(obj);
								res.status(404).send(Jobj);
	                		}
	                	}
	                	else{
							var obj = '{"message": "User with this scase_signature does not exist in S-Case"}';
							var Jobj=JSON.parse(obj);
							res.status(404).send(Jobj);
	                	}
                	});
                }
                else {
					var obj = '{"message": "User with this scase_token does not exist in S-Case"}';
					var Jobj=JSON.parse(obj);
					res.status(404).send(Jobj);
				}
            });
		}
		else{
			//res.setHeader('Content-Type', 'application/json');
			var obj = '{"message": "you miss some parameters"}';
			var Jobj=JSON.parse(obj);
			res.status(400).send(Jobj);
		}
	});
};