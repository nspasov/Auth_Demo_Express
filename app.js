var express 				= require("express");
var mongoose 				= require("mongoose");
var passport 				= require("passport");
var bodyParser 				= require("body-parser");
var User 					= require("./models/user");
var LocalStrategy 			= require("passport-local");
var passportLocalMongoose   = require("passport-local-mongoose");


mongoose.connect("mongodb://localhost/auth_demo_app", { useNewUrlParser: true, useUnifiedTopology: true  });


var app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

app.use(require("express-session")({
	secret: "Vladi is the cutest cat in the world",
	resave: false,
	saveUninitialized: false
}));



app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());  // Passport encrypts data for the request
passport.deserializeUser(User.deserializeUser()); // Passport decrypts data from the request


// ==== ROUTES =====


app.get("/", function(req,res){
	res.render("home.ejs");
});

app.get("/secret", isLoggedIn, function(req,res){
	res.render("secret.ejs");
});

// Auth Routes

app.get("/register", function(req,res){
	res.render("register.ejs");
});

app.post("/register", function(req,res){
	req.body.username
	req.body.password
	User.register(new User({username: req.body.username}), req.body.password, function(err, user){
		if(err){
			console.log(err);
			return res.render("register.ejs");
		}
		passport.authenticate("local")(req, res, function(){
			res.redirect("/secret");
		});
	});

});

app.get("/login", function(req,res){
	res.render("login.ejs");
});

app.post("/login", passport.authenticate("local", {
	successRedirect: "/secret",
	failureRedirect: "/login"
}),function(req,res){

});


app.get("/logout", function(req,res){
	req.logout();
	res.redirect("/");
});


function isLoggedIn(req, res, next){ //middleware - next is the function to be called if true -> line41
	if(req.isAuthenticated()){
		return next();
	}

	res.redirect("/login");
}


app.listen(3000, process.env.IP, function(){
	console.log("Server started!");
});