const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const router = express.Router();
const Listing = require("../models/listing");
const {listingSchema} = require("../Schema.js");


// this is validating errors using joi on server side for listings
const validateListing = (req,res,next)=>{
    // Listing validation
    let {error} = listingSchema.validate(req.body);
    if(error){
        errMsg = error.details.map((el) => el.message).join(",");   
        throw new ExpressError(400, errMsg);
    }
    next();
}


// listings route
router.get("/",wrapAsync(async(req,res)=>{
    let Allposts = await Listing.find({});
    res.render("listings/index",{Allposts});
}))

//new route
router.get("/new", (req,res)=>{
    res.render("listings/new.ejs");
})
/*specific route must be before than parameterized route */
// show route
router.get("/:id",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let post = await Listing.findById(id).populate("reviews");
    if(!post){
        req.flash("error","Listing you requested is Not Found");
        res.redirect("/listing");
        return;
    }
    res.render("listings/show.ejs",{post});
}))
// create route
router.post("",validateListing,wrapAsync(async (req,res)=>{
    let newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect(`/listing/${newListing.id}`);
}))
// edit route
router.get("/:id/edit",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let post = await Listing.findById(id);
    if (!post) {
        // throw new ExpressError(404,"Listing not found");
        req.flash("error","Listing you requested is Not Found");
        res.redirect("/listing");
        // return;
    }else{

        req.flash("success","Edit Success");
        res.render("listings/edit.ejs",{post});
    }
}))

// update listing route
router.put("/:id",validateListing,wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let updatedListing = await Listing.findByIdAndUpdate(id,req.body.listing , {new:true});
    // console.log(updatedListing);
    
    if (!updatedListing) {
        throw new ExpressError(404,"Listing not found");
        
    }
    req.flash("success","Listing Updated!");
    res.redirect(`/listing/${id}`);
}))

// delete route
router.delete("/:id",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    res.redirect("/listing");
}))

module.exports = router;