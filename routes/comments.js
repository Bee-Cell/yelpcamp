var express = require("express");
var router = express.Router({mergeParams:true}); //here we are merging the params from the campground and comments together
var middleware = require("../middleware");//automatically use index.js from middleware
//ading modles //campground
var Campground = require("../models/campground");
var Comment = require("../models/comment");

//------------------------------------------------------
//COMMENTS ROUTE 
//-----------------------------------------------------

//NEW comment route (It is assocated with particular campground)
router.get("/new", middleware.isLoggedIn, function(req, res){
    //console.log(req.params.id);
    //find the particular camgrounds
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){

        }
        else{
           // console.log(foundCampground);
            //render new form and pass the foundCampground
            res.render("comments/new",{campground:foundCampground});
        }
    });
});


//CREATE comment route (it is alos assocated with single particular camgrounds )
router.post("/", middleware.isLoggedIn,function(req, res){

    //find the campground
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
        }
        else{
            // console.log(req.body.comment);  bulk inserting
            // console.log(foundCampground);
            // res.send(foundCampground);
            //create the comment  
            Comment.create(req.body.comment, function(err, newComment){
                if(err){
                    console.log(err);
                }
                else{
                    //console.log(newComment);
                    //assocate the comments with reference object under id 
                    //add username and it to comment and save comment
                   // console.log("New comment's username will be : "+req.user.username);
                   //as per the schema we need to also add the comment author which have id and username. //req.user is gonna give u loged usr if isloggedin
                    newComment.author.id = req.user._id;
                    newComment.author.username = req.user.username;
                    //save the new comment
                    newComment.save();
                    console.log(newComment);
                    foundCampground.comments.push(newComment);
                    foundCampground.save(function(err, newfinalCampground){
                        if(err){
                            console.log(err);
                        }else{
                            //redirect to the show page'
                            req.flash("success", "successful added comment");
                            res.redirect("/campgrounds/"+newfinalCampground._id);
                        }
                    });
                }
            });
        }
    });
    

});

//edit route
// /campgrounds/:id/comments/:id/edit is not valid in nested route 
//because the id comment id will be overrided by campforunds when we params
//thus we nee /campgrounds/:id/comments/:comment_id/edit
router.get("/:comment_id/edit", middleware.checkCommentOwnership ,function(req, res){
    //req.params.id is allready set up as per route design so it is 
    Comment.findById(req.params.comment_id, function(err, founComment){
        if(err){
            res.redirect("back");
        }
        else{
            res.render("comments/edit", {campground_id:req.params.id, comment:founComment });
        }
    });
    
});

//put edit route
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComments){
        if(err){
            res.redirect("back");
        }
        else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

//delte route
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
   //find the comment by find by id comment_id
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        }
        else{
            req.flash("success", "Comment deleted successfully");
           res.redirect("/campgrounds/"+req.params.id); 
        }
    });
   //delete the comment  then delete the comment from the user as wel
});




module.exports = router;