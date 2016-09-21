// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {
	
	'GithubAuth' : {
		'clientID' 		: process.env.GITHUB_CLIENTID,
		'clientSecret' 	: process.env.GITHUB_CLIENTSECRET,
		'callbackURL' 	: 'https://app.scasefp7.com/auth/github/callback'
	},

	'googleAuth' : {
		'clientID' 		: process.env.GOOGLE_CLIENTID,
		'clientSecret' 	: process.env.GOOGLE_CLIENTSECRET,
		'callbackURL' 	: 'https://app.scasefp7.com/auth/google/callback'
	}

};
