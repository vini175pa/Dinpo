var mongoose = require("mongoose")
  , bcrypt   = require("bcrypt");

var schema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	deleted: {
		type: Boolean
	}
});



function authenticate (user, password, done) {

	bcrypt.compare(password, user.get("password"), function(err, res) {
		if(err)
			return done(new Error("Couldn't compare passwords", err));
		else{
			if(res)
				done(null, user);
			else
				done(null, false);
		}
	});

}


schema.methods.setPassword = function(password, done){

	var self = this;

	if(!password)
		return done(new Error("Missing password"));

	bcrypt.genSalt(10, function(err, salt){
		if(err) done(new Error("Failed to create a salt", err))
		else{
			bcrypt.hash(password, salt, function(hashErr, hash){
				if(hashErr)
					return done(new Error("Failed to hash password", err))

				self.set("password", hash);

				done(null, self);
			});
		}
	});
}

schema.methods.authenticate = function(password, done){
	if(!password)
		return done(null, false)

	return authenticate(this, password, done);
}

schema.statics.findByEmail = function(email, done){
	if(!email)
		return done(new Error("Missing email"));

	var query = this.findOne({email: email});


	if(done)
		query.exec(done);
	else
		return query;
}

schema.statics.authenticate = function(){
	var self = this;

	// returns a function because it is used on LocalStrategy
	// otherwise 'this' would be equals a Strategy Object
	return function(email, password, done){
		if(!email || !password)
			return done(null, false);

		self.findByEmail(email, function(err, user){
			if(err) done(err);
			if(!user)
				return done(null, false);
			return user.authenticate(password, done)
		});
	}



}

schema.statics.register = function(user, done) {

	// Create an instance of this in case user isn't already an instance
	if (!(user instanceof this)) {
	  user = new this(user);
	}

	if (!user.get("email")) {
	  return done(new Error("Missing email"));
	}

	var self = this;
	this.findByEmail(user.get("email"), function(err, existingUser) {
	  if (err) { return done(err); }

	  if (existingUser) {
	    return done(new Error("User already exists"));
	  }

	  user.setPassword(user.get("password"), function(setPasswordErr, user) {
	    if (setPasswordErr) {
	      return done(setPasswordErr);
	    }

	    user.save(function(saveErr) {
	      if (saveErr) {
	        return done(saveErr);
	      }

	      done(null, user);
	    });
	  });
	});
};

schema.statics.serializeUser = function(){
	return function(user, done){
		done(null, user.get("_id"));
	}
}

schema.statics.deserializeUser = function(){
	var self = this;
	return function(id, done){
		self.findOne({"_id": id}, done);
	}
}



module.exports = mongoose.model("User", schema);

