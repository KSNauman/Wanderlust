const User = require("../models/user");


module.exports.renderSignupPage = (req, res) => {
    res.render("users/signup");
}

module.exports.signup = async (req, res) => {
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

}

module.exports.renderLoginPage = (req,res) =>{
    res.render("users/login");
}

module.exports.postLoginWork = async(req,res) =>{
    req.flash("success" , "Welcome Back!");
    res.redirect(res.locals.redirectUrl || "/listing");
}

module.exports.logout = (req,res,next)=>{
        req.logout((err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","You have Successfully logged out");
            res.redirect("/listing");
        });
}