const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError");
const {listingSchema} = require("./Schema.js");

// console.log("wa typeof :", typeof wrapAsync);
// console.log("ee typeof :", ExpressError?.name);


app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")));

main().then(()=>{
    console.log("Connected to DB");
}).catch((err) =>{
    console.log(err);
})

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
}

app.get("/",(req,res)=>{
    res.send("Hi , this is root");
})

app.listen(8080,(req,res)=>{
    console.log("Server is listening at port 8080");
})
// testing the connection and creating a sample listing
// You can remove this part later when you have actual listings to work with
// app.get("/testListing",async(req,res)=>{
//     const sampleListing = new Listing({
//         title:"Luxury villa in Bali",
//         description:"A beautiful villa with a private pool",
//         price: 1200,
//         location : "Goa",
//         country: "India"
//     })
//     await sampleListing.save();
//     console.log("Sample was saved");
//     res.send("Listing created successfully");   
// })
// this is validating errors using joi on server side 
const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    errMsg = error.details.map((el) => el.message).join(",");   
    if(error){
        throw new ExpressError(400, errMsg);
    }
    next();
}

// listings route
app.get("/listing",wrapAsync(async(req,res)=>{
    let Allposts = await Listing.find({});
    // console.log(Allposts);
    res.render("listings/index",{Allposts});
}))

//new route
app.get("/listing/new", (req,res)=>{
    res.render("listings/new.ejs");
})
/*specific route must be before than parameterized route */
// show route
app.get("/listing/:id",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let post = await Listing.findById(id);
    if(!post){
        throw new ExpressError(404,"Listing not found");
    }
    res.render("listings/show.ejs",{post});
}))
// create route
app.post("/listing",validateListing,wrapAsync(async (req,res)=>{
    // console.log(req.body);
    let newListing = new Listing(req.body.listing);
    
    // console.log("Validation result:", result);
    await newListing.save();
    console.log(newListing.id)
    res.redirect(`/listing/${newListing.id}`);
}))
// edit route
app.get("/listing/:id/edit",validateListing,wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let post = await Listing.findById(id);
    if (!post) {
        throw new ExpressError(404,"Listing not found");
    }
    res.render("listings/edit.ejs",{post});
}))

// update listing route
app.put("/listing/:id",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    // console.log(...req.body.listing);
    let updatedListing = await Listing.findByIdAndUpdate(id,req.body.listing , {new:true});
    if (!updatedListing) {
        throw new ExpressError(404,"Listing not found");
    }
    res.redirect(`/listing/${id}`);
}))

// delete route
app.delete("/listing/:id",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listing");
}))

// Reviews module
// app.post("/listing/:id/reviews",wrapAsync(async(req,res)=>{
    
// }))


app.all(/.*/,(req,res,next)=>{
   next(new ExpressError(404,"Page not found"));
})
// the most error occuring part 
app.use((err,req,res,next)=>{
    
    let {status = 500 , message = "Something went wrong"} = err;
    res.status(status).render("error/error.ejs",{message});
})

