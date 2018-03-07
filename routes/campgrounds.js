var express = require("express");
var router = express.Router();
var middleware = require("../middleware");//automatically use index.js from middleware
var Campground = require("../models/campground");//importing campground .js from model to work with it



//not declearing variable app
//we are adding all the routes to the route rather than app
//it is very worthy. to do in router then the app

//--------------------------------------
// ROUTES CAMPGROUNDS
//-------------------------------------


//campgrounds index Route
router.get("/", function(req, res){
    //passport make the req.user and strore username and other details but not password
    // console.log(req.user);
    //find all campgrounds db campgrounds
    Campground.find({}, function(err, campgrounds){
        if(err){
            console.log(err);
        }
        else{
            //render to the index of campgrounds
            res.render("campgrounds/index", {campgrounds:campgrounds});//, currentUser:req.user middleware does this
        }
    });
});

//NEW Route
router.get("/new", middleware.isLoggedIn ,function(req, res){
    //render to new form page
    res.render("campgrounds/new");
});

//POST Route
router.post("/", middleware.isLoggedIn ,function(req, res){
    //get data from and add to campgrounds array body parserwill do that
    Campground.create({
                name:req.body.name, 
                image:req.body.imageUrl,
                description:req.body.description,
                author:
                    {
                        id: req.user._id,
                        username:req.user.username
                    }

            }, function(err, newlyCreated){
                if(err){
                    res.redirect("/campgrounds/new"); //route
                }else{
                    //redirect back to campgrounds page
                    console.log(newlyCreated);
                    res.redirect("/campgrounds");//default to get route of /camgrounds not post
                }
            });    
});

//SHOW Route
router.get("/:id", function(req, res){
    //find a particular campground
   // console.log(req.params.id);
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
            // res.redirect("/campgrounds");
        }else{
            //render to the show page of particular campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});




//edit route
router.get("/:id/edit", middleware.checkCampgroundOwnership ,function(req, res){
    // is user logged in?
    //     does user owns the campgroud
    //         if allow the permison
    //     otherwise redirect
    // other redirect,


    //is user logged in
        Campground.findById(req.params.id,function(err, foundCampground){
            res.render("campgrounds/edit",{campground:foundCampground});
        });  
});

//update campgrond route
//post man bata form access garera send garna sakcha
router.put("/:id",middleware.checkCampgroundOwnership , function(req, res){
    //res.render(req.body.name);
    //find and update the correct camgrounds
    // var reqData = { 
    //         name:req.body.name,
    //         image:req.body.image,
    //         description:req.body.description

    //     }
    Campground.findByIdAndUpdate(req.params.id,req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
    //redirect to the show pages
});

//delete campground route
router.delete("/:id", middleware.checkCampgroundOwnership ,function(req, res){
    //find campground and delte it
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        }else{
             //render to the home page of campgrounds
            res.redirect("/campgrounds");
        }
    });
  
});


module.exports = router;