module.exports = function(config){

	var mongoose = require("mongoose"),
		log = require("debug")("Dinpo:mongodb"),
		log_error = require("debug")("Dinpo:mongodb:error");;

	log("Creating Mongo DB connection string");
	var conn_string = ""
		+ config.MONGODB_HOST + ":"
		+ config.MONGODB_PORT + "/"
		+ config.MONGODB_DB;

	if(config.MONGODB_PASSWORD){
		log("Adding user and password to connection string");
		conn_string= config.MONGODB_USER + ":"
		+ config.MONGODB_PASSWORD + "@"
		+ conn_string
	}

	log("Trying to connect %s", conn_string);
	mongoose.connect(conn_string, function(err, res){
		if(err)
			log_error("Error connecting to %s %j", conn_string, err);
		else
			log("Mongo DB successfully connected to %s", conn_string);
	});

	return mongoose;
}
