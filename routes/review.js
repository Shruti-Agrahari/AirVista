const express= require("express");
const router = express.Router({mergeParams:true});
//Requiring the model form listing.js
const Listing = require('../models/listing.js');
//Requiring the model form review.js
const Review = require('../models/review.js');

//require wrapAsync function
const wrapAsync = require("../utils/wrapAsync.js");
//require ExpressError
const ExpressError  = require("../utils/ExpressError.js");
const {reviewSchema} = require("../utils/Joi.js");
const {validateReview,isReviewAuthor} = require("../middleware.js");
const isLoggerIn = require("../middleware.js");

//Controllers(review.js)
const reviewController = require("../controllers/review.js");

// const validateReview = (req,res,next)=>{
//     let {error}= reviewSchema.validate(req.body);
//     console.log(error);
//     if(error){
//          let errMsg = error.details.map((el)=>el.message).join(",");
//         throw new ExpressError(400,errMsg);
//     }
//     else{
//         next();
// };
// };

//Review Route (accepting post request)
router.post("/",isLoggerIn,validateReview,wrapAsync (reviewController.createReview));

 //Delete review route
 router.delete("/:reviewID",isReviewAuthor,wrapAsync(reviewController.deleteReview));


 module.exports= router;