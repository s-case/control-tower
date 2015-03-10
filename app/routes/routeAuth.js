module.exports = function(app, passport) {
	
// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

	// github -------------------------------

	// send to github to do the authentication
	app.get('/auth/github', passport.authenticate('github', { scope : 'email' }));

	// handle the callback after github has authenticated the user
	app.get('/auth/github/callback',
		passport.authenticate('github', {
			successRedirect : '/displayOwnprojects/github',
			failureRedirect : '/'
		}));

	
// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

	// github -------------------------------

	// send to github to do the authentication
	app.get('/connect/github', passport.authorize('github', { scope : 'email' }));

	// handle the callback after github has authorized the user
	app.get('/connect/github/callback',
		passport.authorize('github', {
			successRedirect : '/displayOwnprojects/github',
			failureRedirect : '/'
		}));


}

