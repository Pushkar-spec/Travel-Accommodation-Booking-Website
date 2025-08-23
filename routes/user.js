const express = require("express");
const router = express.Router({mergeParams : true});
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middlewares.js");

const userController = require("../controllers/users.js");

router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

router.post("/signup", wrapAsync(userController.signup));

router.get("/login", (req, res) => {
    res.render("users/login.ejs");
})

router.post("/login",
    saveRedirectUrl,
    passport.authenticate("local", {failureRedirect : "/login", failureFlash : true}),
    wrapAsync(userController.login));

router.get("/logout",userController.logout);

module.exports = router