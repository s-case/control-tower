// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {


	'GithubAuth' : {
		'clientID' 		: process.env.GITHUB_CLIENTID,
		'clientSecret' 	: process.env.GITHUB_CLIENTSECRET,
		'callbackURL' 	: 'http://scouter.ee.auth.gr:3000/auth/github/callback'
	},

	'googleAuth' : {
		'clientID' 		: '628673878460-eiv3up0u03fotj4tbveuuq72lrhf3rsd.apps.googleusercontent.com',
		'clientSecret' 	: 'WoAp2IF-XD_zl8s0FB5sRdXl',
		'callbackURL' 	: 'http://scouter.ee.auth.gr:3000/auth/google/callback'
	}

};
