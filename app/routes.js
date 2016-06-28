var User = require('./models/user');  // load the User mongoose model for passport.js authentication

module.exports = function(app, passport) {

	// GET /auth/github
	//   Use passport.authenticate() as route middleware to authenticate the
	//   request.  The first step in GitHub authentication will involve redirecting
	//   the user to github.com.  After authorization, GitHub will redirect the user
	//   back to this application at /auth/github/callback
	app.get('/auth/github',
	passport.authenticate('github', { scope: [ 'user:email', 'public_repo' ] }),
	function(req, res) {
		// The request will be redirected to GitHub for authentication, so this
		// function will not be called.
	});

	// GET /auth/github/callback
	//   Use passport.authenticate() as route middleware to authenticate the
	//   request.  If authentication fails, the user will be redirected back to the
	//   login page.  Otherwise, the primary route function will be called,
	//   which, in this example, will redirect the user to the home page.
	app.get('/auth/github_oauth/callback',
	passport.authenticate('github', { failureRedirect: '/auth/github' }),
	function(req, res) {
		res.redirect('/repos');
	});

	app.get('/logout', function(req, res){
		req.logout();
		res.redirect('/');
	});

	// check if the user is logged in an retrieve a different user obj based on the status
	app.get('/isAuthenticated', function(req, res) {
		res.json(isAuthenticated(req));
	});

	isAuthenticated = function(req) {
		if (req.isAuthenticated()) {
			var user = JSON.parse(JSON.stringify(req.user));
			return user;
		}
		return null;
	}
};
