if(process.env.NODE_ENV != "production"){
   require('dotenv').config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError  = require("./utils/ExpressError.js");
const Joi = require('joi');
const session= require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


//atlas db url link
let dbURL = process.env.ATLASDB_URL;
 
const store = MongoStore.create({
   mongoUrl: dbURL,
   crypto: {
      secret: process.env.SECRET,
   },
   touchAfter: 24 * 3600,
   
});
store.on("error",()=>{
   console.log("error occured in mongo session store",err);
});
 
const sessionOptions = {
   store:store,
   secret: process.env.SECRET,
   resave:false,
   saveUninitialized: true,
   cookie:{
      expires:Date.now() + 7 * 24 * 60 * 60 * 1000,
      maxAge:7 * 24 * 60 * 60 * 1000,
   },
};
//Middleware for sessions
app.use(session(sessionOptions));
//Middleware for connect- flash
app.use(flash());

//Passports function (mandatory to write after sessions are defined)
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Middleware for showing the flash messages
app.use((req,res,next)=>{
   res.locals.successMessage = req.flash("success");
   res.locals.error = req.flash("error");
   res.locals.currUser = req.user;
   next();
});

//Requiring routes
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const user = require("./routes/user.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

//Requiring the model form review.js
const Review = require('./models/review.js');


//Mongoose connection
   main().then((res)=>{
    console.log("conection successfull");
   }).catch((err)=>{
    console.log(err);
   });
 async function main(){
    await mongoose.connect(dbURL);
 }


 //Demo user
 app.get("/demouser",async(req,res)=>{
   let fakeUser = new User({
      email:"abc@gmail.com",
      username:"abc",
   });
  let registeredUser = await User.register(fakeUser,"helloWorld");
  res.send(registeredUser);
 })

 //listing routes and review routes
app.use("/listings", listings);
app.use("/listings/:id/reviews",reviews);
app.use("/",user);
 



  //Error handling middlewares
  app.use((err,req,res,next)=>{
   let {status=500, message="Something Went Wrong"} = err;
   res.status(status).render("error.ejs", {err});
  })

//basic express setup
// app.get("/",(req,res)=>{
//     res.send("At root!!");
// });

 //middleware to handle error when user have sent request to an undefined path
 app.all("*",(req,res,next)=>{
   next(new ExpressError(404,"page not found"));  
});
app.listen(8080,()=>{
    console.log("listening at port 8080");
})