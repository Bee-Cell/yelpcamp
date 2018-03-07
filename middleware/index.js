var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middlewareObj = {};


middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                req.flash("error", "Campground not found");
                res.redirect("back");
            }else{
                //DOES USER OWNS THE CAMPGROUNDS?
                //checking show page campground id vs login user id
                //cannot campare login user id and show page campground id with === sign  one is object and another string respectively
                if(foundCampground.author.id.equals(req.user._id)) {
                    //render the forms
                    next();
                  
                }else{
                    req.flash("error", "You dont have permisson ");
                    res.redirect("back");                }
                
            }
        });
    }else{
        req.flash("error", "You need to be login")
        res.redirect("back");//back redirect to where they come from
        }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            }else{
                //DOES USER OWNS THE Comment?
                //checking show page campground id vs login user id
                //cannot campare login user id and show page campground id with === sign  one is object and another string respectively
                if(foundComment.author.id.equals(req.user._id)) {
                    //render the forms
                    next();
                  
                }else{
                    req.flash("error", "You dont have permisson");
                    res.redirect("back");                }
                
            }
        });
    }else{
        req.flash("error", "you need to be login");
        res.redirect("back");//back redirect to where they come from
        }
}


//middleware
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }

    req.flash("error", "You need to be logged in to do that!"); 
    //it wont be display on to the next page
    res.redirect("/login"); //we will see message on login route completes
    //it only gives capbilities of passing the eroor through flash but we need to handle on the page where it is redirected to route and thefor to templates
}



module.exports = middlewareObj;