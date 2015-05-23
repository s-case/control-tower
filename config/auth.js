// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {
	
	'GithubAuth' : {
		'clientID' 		: process.env.GITHUB_CLIENTID,
		'clientSecret' 	: process.env.GITHUB_CLIENTSECRET,
		'callbackURL' 	: 'http://scouter.ee.auth.gr:3000/auth/github/callback'
	},

	'googleAuth' : {
		'clientID' 		: process.env.GOOGLE_CLIENTID,
		'clientSecret' 	: process.env.GOOGLE_CLIENTSECRET,
		'callbackURL' 	: 'http://scouter.ee.auth.gr:3000/auth/google/callback'
	}

};
