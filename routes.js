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
		req.session.test1 = "aaa";
		req.session.save();
		passport.authenticate('local', function(err, user, info) {
			if (err) { return res.json({error: err, user: null}); }
			if (!user) { return res.json({error: err, user: null}); }
			req.logIn(user, function(err) {
				if (err) { return res.json({error: err, user: null}); }
				return res.json({error: null, user: user});
			});
		})(req, res, next);
	});


	return router;
}