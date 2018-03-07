var     express     = require("express"),
        app         = express(),
        bodyParser  = require("body-parser"),
        mongoose    = require("mongoose"),
        passport    = require("passport"),
      localStrategy = require("passport-local"),
        flash       = require("connect-flash");
    methodOverride  = require("method-override"),
        seedDB      = require("./seeds"),
        Campground  = require("./models/campground"),
        Comment     = require("./models/comment");
        User        = require("./models/user");

//--------------------------------------------
//ROUTES IMPORTING
//---------------------------------------------
var commentRoutes = require("./routes/comments"),
    campgroundsRoutes = require("./routes/campgrounds"),
    authRoutes = require("./routes/auth");

//APP CONFIG    
mongoose.connect("mongodb://localhost/yelpcamp");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+ "/public"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash());
seedDB(); //seed the database

//-----------------------------------------------
//Passport and authentication configuration
//----------------------------------------------
app.use(require("express-session")({
    secret: "i am a session",
    resave: false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



//--------------------------------------------
//MIDDLEWARE
//---------------------------------------------
app.use(function(req, res, next){
    res.locals.currentUser = req.user; //passing user in every single 
    res.locals.error       = req.flash("error"); //available error to everyflash
    res.locals.success     = req.flash("success"); //available sucess to everyflash
    next(); //to move in route handleer 
});


//-----------------------------------------------
app.use("/campgrounds",campgroundsRoutes); //it appends the campgrounds route declearton after "/campgrounds"
app.use("/campgrounds/:id/comments",commentRoutes); //i
app.use("/", authRoutes);

//------------------------------------------------------
//RUNING SERVER
//-----------------------------------------------------
//listen
app.listen(3000, function(){
    console.log("SERVER IS RUNNING");
});