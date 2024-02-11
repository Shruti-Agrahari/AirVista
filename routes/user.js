const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router({mergeParams:true});
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");



//Controllers(user.js)
const userController = require("../controllers/user.js");

//signup routes
router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signup));

//login routes
router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl,passport.authenticate("local", {failureRedirect : "/login", failureFlash : true}) ,wrapAsync(userController.login));

//Logout route
router.get("/logout",userController.logout);
module.exports = router;

// //signup routes
// router.get("/signup",userController.renderSignupForm);
// router.post("/signup",wrapAsync(userController.signup));

// //login routes
// router.get("/login",userController.renderLoginForm);

// router.post("/login",saveRedirectUrl,passport.authenticate("local", {failureRedirect : "/login", failureFlash : true}) ,wrapAsync(userController.login));

