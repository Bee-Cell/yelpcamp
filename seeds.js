var mongoose =  require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
		{
			name: "Clouds rest",
			image: "https://cdn.pixabay.com/photo/2017/12/18/19/10/nature-3026732__340.jpg",
			description:"balh balha balha ba;asdaasfasfdsf"
		},
		{
			name: "Sisneri bas",
			image: "https://cdn.pixabay.com/photo/2017/08/07/02/34/people-2598902__340.jpg",
			description:"balh balha balha ba;asdaasfasfdsf"
		},
		{
			name: "Dhaman the great",
			image: "https://cdn.pixabay.com/photo/2017/09/26/13/50/rv-2788677__340.jpg",
			description:"balh balha balha ba;asdaasfasfdsf"
		}
	];

function seedDB(){
	//remove all campgrounds
	Comment.remove({}, function(err){
		if(err){
			console.log(err);
		}else{
			console.log("remove existing comments");
			Campground.remove({}, function(err){
				if(err){
					console.log(err);
				}else{
					 console.log("removed existing Campgrounds");
					//add a few campgrounds
					
					
				}
				
			});
		}
	});
	
	
}


module.exports = seedDB;