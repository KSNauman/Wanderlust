const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const Review = require("./models/review");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");


const listings = require("./routes/listing");
const reviews = require("./routes/review");
const userRouter = require("./routes/user");

// console.log("wa typeof :", typeof wrapAsync);
// console.log("ee typeof :", ExpressError?.name);




main().then(()=>{
    console.log("Connected to DB");
}).catch((err) =>{
    console.log(err);
})

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
}

app.listen(8080,(req,res)=>{
    console.log("Server is listening at port 8080");
})
app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")));

const sessionOptions = {
    secret : "mysupersecretcode",
    resave : false,
    saveUninitialized : true,   
    cookie:{
        expires : Date.now() + 7 * 24 * 60 * 60 *1000,
        maxAge : 7 * 24 * 60 * 60 *1000,
        httpOnly : true,
    }
    
};





app.get("/",(req,res)=>{
    res.send("Hi , this is root");
})
// always use these in above of routes
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    // console.log(res.locals.success);
    
    next();
})

app.get("/demouser", async(req,res)=>{
    let fakeuser = new User({
        email:"abc@gmail.com",
        username : "Abc",
    });
    let registeredUser = await User.register(fakeuser,"Hello world");
    res.send(registeredUser);
})

app.use("/listing", listings);
app.use("/listing/:id/reviews",reviews);
app.use("/",userRouter);




app.all(/.*/,(req,res,next)=>{
   next(new ExpressError(404,"Page not found"));
})
// the most error occuring part 
app.use((err,req,res,next)=>{
    // console.log(err);
    console.log(err);
    
    let {status = 500 , message = "Something went wrong"} = err;
    res.status(status).render("error/error.ejs",{message});
})

