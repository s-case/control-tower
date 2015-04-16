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
			successRedirect : '/profile',
			failureRedirect : '/'
		}));

	// google ---------------------------------

	// send to google to do the authentication
	app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

	// the callback after google has authenticated the user
	app.get('/auth/google/callback',
		passport.authenticate('google', {
			successRedirect : '/profile',
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
			successRedirect : '/profile',
			failureRedirect : '/'
		}));

	//google-------

	// send to google to do the authentication
	app.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

	// the callback after google has authorized the user
	app.get('/connect/google/callback',
		passport.authorize('google', {
			successRedirect : '/profile',
			failureRedirect : '/'
		}));

}

