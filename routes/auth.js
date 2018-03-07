var express = require("express");
var router = express.Router();
var middleware = require("../middleware");//automatically use index.js from middleware
//import the user model
var User = require("../models/user");
//import passport
var passport = require("passport");


//-------------------------------------------------
//AUTH ROUTES
//----------------------------------------------------
//root
router.get("/", function(req, res){
    res.render("landing");
});

//show register form
router.get("/register", function(req, res){
    res.render("register");
});

//handle sgin up logic
router.post("/register", function(req, res){
    User.register(new User({username:req.body.username}), req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.redirect("/register");
        }
            passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to yelp camp"+ user.username);
           res.redirect("/campgrounds");
        });
    });
});

//show login form
router.get("/login", function(req, res){
    //message is captured from the middleware is login 
    //res.render("login", { message:req.flash("error")});
    //we can then pass the message to the login tamplets and its header but it will be available as undefined in every tempaltes
    //instedad of doing that we do it in app and avilable to all the header
    res.render("login");
});

router.post("/login",passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }) ,function(req, res){
});


router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "log you out");
    res.redirect("/campgrounds");
});



module.exports = router;