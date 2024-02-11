
const Listing = require("../models/listing");

 module.exports.index = async(req,res,next)=>{
    const alListings = await Listing.find({});
    res.render("./listings/index.ejs",{alListings});
}

module.exports.renderNewForm =(req,res)=>{
    res.render("./listings/new.ejs");
};

module.exports.createListing = async(req,res,next)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing =  new Listing(req.body.listing);//in new.ejs we have created a object listing[key] in name key value pair and here in app.js we are fetching the data that came in req.body by req,body.listing and then passing it to the insertion function in mongoDB.
    newListing.owner =  req.user._id;
    newListing.image = {url, filename}; 
    await newListing.save();
    req.flash("success","New Listing Added");
    res.redirect("/listings")
 }

 module.exports.showListing = async (req,res,next)=>{
    let {id}= req.params;
    const showListings = await Listing.findById(id).populate({path:"review",populate:{path:"author"},}).populate("owner");
    if(!showListings){
        req.flash("error","Listing you are trying to access does not exist");
        res.redirect("/listings");
    }
    //console.log(showListings);
    res.render("./listings/show.ejs",{showListings});
}

module.exports.editListing= async (req,res,next)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Lising you are trying to access does not exist");
        res.redirect("/listings");
    };
    //to degrade quality of the picture
    let originalImageUrl = listing.image.url;
    // console.log(originalImageUrl);
    originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250");
    res.render("./listings/edit.ejs",{listing,originalImageUrl});
}

module.exports.saveUpdate = async(req,res,next)=>{
    let {id}= req.params;
   let listing= await Listing.findByIdAndUpdate(id,{...req.body.listing});
   if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename};
    await listing.save();
   }
   req.flash("success","Listing is updated");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async(req,res)=>{
    let {id}= req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted");
    res.redirect("/listings");
}