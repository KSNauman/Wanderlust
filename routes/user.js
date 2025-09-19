const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const User = require("../models/user");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware");
// signup route
router.get("/signup",
    (req, res) => {
    res.render("users/signup");
})

router.post("/signup",
    wrapAsync(async (req, res) => {
    try {
        let { username, email, password } = req.body;
        let newUser = new User({ email, username });
        const registeredUser =await User.register(newUser, password);
        req.login(registeredUser , (err)=>{
            if(err){
                return next(err);
            }
            req.flash("success" , "Welcome to WanderLust");
        res.redirect("/listing");
        })
        
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }

}));

router.get("/login",
    (req,res) =>{
    res.render("users/login");
})

router.post("/login",
    saveRedirectUrl,
    passport.authenticate('local', { 
        failureRedirect: '/login',
        failureFlash: true }),
    wrapAsync(async(req,res) =>{
    req.flash("success" , "Welcome Back!");
    res.redirect(res.locals.redirectUrl || "/listing");
}));

// logout route
router.get("/logout",
    (req,res,next)=>{
        req.logout((err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","You have Successfully logged out");
            res.redirect("/listing");
        });
})

module.exports = router;