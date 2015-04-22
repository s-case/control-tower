var mysql = require('mysql');
var dbconfig = require('../config/database');
var connConstant = require('../config/ConnectConstant');
var connection; 
var ownerflag;
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
checkIfOwner();
module.exports.connection =ownerflag;
