var mongoose 				= require("mongoose");
var passportLocalMongooser  = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
	username: String,
	password: String
});

UserSchema.plugin(passportLocalMongooser);

module.exports = mongoose.model("User", UserSchema);