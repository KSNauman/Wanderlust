if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");


const listings = require("./routes/listing");
const reviews = require("./routes/review");
const userRouter = require("./routes/user");

// console.log("wa typeof :", typeof wrapAsync);
// console.log("ee typeof :", ExpressError?.name);

const dburl = process.env.ATLAS_DB;
// console.log(dburl);


async function main() {
    // await mongoose.connect( "mongodb://127.0.0.1:27017/wanderlust")
    await mongoose.connect(dburl)
    
}

main().then(()=>{
    console.log("Connected to DB");
}).catch((err) =>{
    console.log(err);
})


app.listen(8080,(req,res)=>{
    console.log("Server is listening at port 8080");
})
app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")));

const store = MongoStore.create({
    mongoUrl:dburl,
    crypto: {
    secret: process.env.SECRET,
    },
    touchAfter : 24* 60 * 60
})

store.on("error",()=>{
    console.log("session store error",err);
});

const sessionOptions = {
    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,   
    cookie:{
        expires : Date.now() + 7 * 24 * 60 * 60 *1000,
        maxAge : 7 * 24 * 60 * 60 *1000,
        httpOnly : true,
    }
    
};

// always use these in above of routes
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// local variables
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    // console.log(res.locals.success);
    
    
    next();
})


app.use("/listing", listings);
app.use("/listing/:id/reviews",reviews);
app.use("/",userRouter);




app.all(/.*/,(req,res,next)=>{
    // console.log("Original url",req.originalUrl);
    
   next(new ExpressError(404,"Page not found"));
})
// the most error occuring part 
app.use((err,req,res,next)=>{
    console.log(err);
    // console.log(err.message);
    
    let {status = 500 , message = "Something went wrong"} = err;
    res.status(status).render("error/error.ejs",{message});
})

