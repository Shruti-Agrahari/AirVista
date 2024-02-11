const mongoose = require("mongoose");
const Review = require("./review.js");

//Schema for listing
 const Schema =  mongoose.Schema;
const listingSchema = new Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
    },
    image:{
        url:String,
        filename:String,  
    },
    price:{
        type:Number,
    },
    location:{
        type:String,
    },
    country:{
        type:String,
    },
    review:[{
       type:Schema.Types.ObjectId,
       ref: "Review",
    }],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    category:{
        type:String,
        enum:["Arctic","Pools","Iconic cities","Rooms","Mountains","Pools","Castles","Trending","Farms"],
    },
});
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing && listing.review){
    await Review.deleteMany({_id:{$in: listing.review}});
    };
});

//Model
const Listing = mongoose.model("Listing",listingSchema);
 

module.exports = Listing;
