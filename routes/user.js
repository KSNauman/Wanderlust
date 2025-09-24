const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware");
const userController = require("../controllers/users");

// signup route
router.route("/signup")
    .get(userController.renderSignupPage)
    .post(wrapAsync(userController.signup));

// login route
router.route("/login")
    .get(userController.renderLoginPage)
    .post(saveRedirectUrl,
        passport.authenticate('local', { 
            failureRedirect: '/login',
            failureFlash: true }),
        wrapAsync(userController.postLoginWork));

// logout route
router.get("/logout",
    userController.logout)

module.exports = router;