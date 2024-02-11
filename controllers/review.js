
const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
     newReview.author = req.user._id;
      listing.review.push(newReview);

      await newReview.save();
      await listing.save();//just because we did updation that's the reason for resaving the listing doc
      console.log(newReview);
      req.flash("success","Review Added");
      res.redirect(`/listings/${listing._id}`);
 }

 module.exports.deleteReview = async(req,res)=>{
    let{id,reviewID}= req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{review: reviewID}});
   await Review.findByIdAndDelete(reviewID);
   req.flash("success","Review Deleted");
   res.redirect(`/listings/${id}`);
 }