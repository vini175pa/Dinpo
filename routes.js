module.exports = function (passport) {
	var express = require('express'),
		router = express.Router();

	var log = require('debug')("Dinpo:test");


	router.get("/", function (req, res, next) {
		var user = req.user;

		if(user) delete user.password;

		res.render('index', {user: user});
	});

	router.get("/logout", function (req, res, next) {
		req.logout();
		res.redirect("/");
	});

	router.post("/logout", function (req, res, next) {
		req.logout();
		res.json({});
	});


	router.post("/login", function (req, res, next) {
		passport.authenticate('local', function(error, user, info) {
			var asJSON = req.headers.accept.indexOf("application/json") > -1;

			if (error || !user)
				return asJSON ? res.status(401).json({error: error ? error.message : error, user: null}) : res.redirect("/?login_error=1");



			req.logIn(user, function(err) {
				if (err){
					return asJSON ? res.status(500).json({error: err, user: null}) : res.redirect("/?login_error=1");
				}

				asJSON ? res.json({error: err, user: user}) : res.redirect("/");

			});

		})(req, res, next);
	});


	return router;
}