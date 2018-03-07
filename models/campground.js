var mongoose = require("mongoose");

//SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description:String,
    author:
	    {
	    	id: {
		    		type:mongoose.Schema.Types.ObjectId,
		    		ref:"User"
	    		},
    		username:String
		},
    comments: [
	    		{
	    			type: mongoose.Schema.Types.ObjectId,
	    			ref: "Comment"
	    		}
    		]
	}
);

//create the single camp
// Campground.create(
//     {
//         name:"Workcamping", 
//         image:"https://cdn.pixabay.com/photo/2017/10/28/23/18/indians-2898463__340.jpg"
//     }, function(err, campground){
//         if(err){
//             console.log(err);
//         }else{
//             console.log("newly created campground");
//             console.log(campground);
//         }
//     });


//compile the schema into model
module.exports = mongoose.model("Campground", campgroundSchema);