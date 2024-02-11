//Here we are inserting our data in db

const mongoose = require("mongoose");
const Listing = require('../models/listing.js');
const initData = require("./data.js");

//Mongoose connection
main().then((res)=>{
    console.log("conection successfull");
   }).catch((err)=>{
    console.log(err);
   });
 async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
 }

 //Inserting data
 const initDB = async ()=>{
     await Listing.deleteMany({});
     //Inserting owner(For authorization)
     //initdata.data me map function lga kar we are trying to add owner in listing objects
     initData.data = initData.data.map((obj)=>({...obj,owner:"65b383e127048fa4be2761d5"}))
     await Listing.insertMany(initData.data);
     console.log("data inserted");
 }
 initDB();