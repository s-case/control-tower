# S-CASE Authentication

###Installation
For the installation of the Control Tower one should install the following (installation commands for Ubuntu 14.04 are provided in parenthesis): 
* Node.js (sudo apt-get install nodejs)
*	npm (sudo apt-get install npm)
*	bower (sudo npm install -g bower)
*	MySQL (sudo apt-get install mysql-server)
#Following the installation of the above, the following commands must be performed from the directory of the Control Tower: 
#npm install
It installs all the dependencies to be found in the package.json file. These are the following: 
*	"bcrypt-nodejs": "latest",
*	"body-parser": "~1.0.0",
*	"connect-flash": "~0.1.1",
*	"cookie-parser": "~1.0.0",
*	"ejs": "~0.8.5",
*	"express": "~4.0.0",
*	"express-session": "~1.0.0",
*	"method-override": "~1.0.0",
*	"morgan": "~1.0.0",
*	"mysql": "^2.4.3",
*	"passport": "~0.1.17",
*	"passport-github": ">=0.0.0",
*	"passport-google-oauth" : "~0.1.5",
*	"crypto-js" : "~3.1.2-5",
*	"base64url" : "~1.0.4",
*	"forever"   : "~0.14.1",
*	"forever-monitor" : "~1.5.2",
*	"express-jwt" : "*",
*	"jsonwebtoken" : "*",
*	"request" : "*",
*	"requirejs": "*"
#	bower install
It installs all the dependencies to be found in the bower.json file. These are the following: 
*"angular": "1.2.18"
*	"jquery": "~1.11",
*	"angular-sanitize": ">=1.2.18",
*	"angular-mocks": ">=1.2.18"
*	"ui-select" : "0.11.2"
The files in the scripts/ folder are the sql scripts that need to be executed in the MySQL environment. The following tables are created:
*	Users table
*	Projects table
*	Owners table (foreign key to Users and Projects table)
*	Collaborators table (foreign key to Users and Projects table)
The files in the config/ folder are the configuration files that need also to be set. In specific, there are the following files:
*	config/ArtRepo.js: In which the url of the S-CASE Artefacts Registry is set.
*	config/auth.js: In which the following details are set: 
* Github authentication mechanism info (taken from the Gitbub developers applications settings https://github.com/settings/developers in which one must create an application)
  *	clientID (for security reason set as Environmental variable)
  *	clientSecret (for security reason set as Environmental variable)
  *	callbackURL
*	Google authentication mechanism info (taken from the Google developers platform https://console.developers.google.com/project where one must create first a new project and then in the APIs & Auth tab a new OAUTH client for a Web Application).
  *	clientID (for security reason set as Environmental variable)
  * clientSecret (for security reason set as Environmental variable)
  * callbackURL
*	config/database.js: In which the following details regarding the Control Tower MySQL database are set
  *	'connection': {
    'host': The host of the database,
    'user': The username of the administrator of the database of the Control Tower (for security reason set as Environmental variable)
    'password': The password of the administrator (for security reason set as Environmental variable)
    }
  *	'database': The name of the MySQL database of the Control Tower
  *	'users_table': The name of the table of the users
  *	'projects_table' : The name of the table of the projects
  *	'owners_table' : The name of the table with the owners
  *	'collaborators_table' : The name of the table with the collaborators
Last but not least, in the /server.js file one can set the port to which the Control Tower receives the various calls. It is set to be the value of the environmental variable “PORT” or to 3000. 
In order for the Control Tower to be executed the following two commands can be executed inside the root folder of the control tower (/) (one or the other)
*	node server.js, standardized node.js server start command
*	forever start server.js, the server is started using “forever” which is a simple CLI tool for ensuring that a given node script runs continuously (i.e. forever) (https://www.npmjs.com/package/forever)


###Start with node server.js or node forever.js
url: http://scouter.ee.auth.gr:3000

###API details
https://github.com/s-case/control-tower/tree/master/docs
