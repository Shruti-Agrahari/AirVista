const express= require("express");
const app = express();
// const router = express.Router({mergeParams:true});
const Listing = require('../models/listing.js');

app.get("/:category",async(req,res)=>{
   let{category}= req.params;
    // res.send(listing);
    console.log(category);
})


