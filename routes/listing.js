
if(process.env.NODE_ENV !="production"){
    require("dotenv").config();
}

//----This file contains all the routes associated with listings
const express = require("express");
const router = express.Router({mergeParams:true});
//Requiring the model form listing.js
const Listing = require('../models/listing.js');
//require wrapAsync function
const wrapAsync = require("../utils/wrapAsync.js");
//require ExpressError
// const ExpressError  = require("../utils/ExpressError.js");
// const {listingSchema,reviewSchema} = require("../utils/Joi.js");
const isLoggedIn = require("../middleware.js");
const {isOwner,validateListing} = require("../middleware.js");

//Controllers(listing.js)
const listingController = require("../controllers/listing.js");


//cloudinary
const multer  = require('multer')
const{storage} = require("../cloudconfig.js");
const isLoggerIn = require("../middleware.js");
const upload = multer({storage});

router.route("/")
.get( wrapAsync(listingController.index))
.post(isLoggedIn,upload.single("listing[image]"),validateListing, wrapAsync(listingController.createListing));

//CREATE NEW LISTING route
router.get("/new",isLoggedIn,listingController.renderNewForm);

router.route("/:id")
.get( wrapAsync(listingController.showListing))
.put(isLoggerIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingController.saveUpdate))
.delete( isLoggedIn,isOwner,wrapAsync(listingController.deleteListing));


//Edit route
router.get("/:id/edit", isLoggedIn,isOwner,wrapAsync(listingController.editListing));


module.exports= router;