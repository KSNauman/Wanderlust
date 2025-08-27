const express = require("express");
const router = express.Router({ mergeParams: true });
// this route has params so this is required
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const Listing = require("../models/listing");
const {reviewSchema} = require("../Schema.js");
const Review = require("../models/review");

// this is validating errors using joi on server side for reviews 
const validateReview = (req,res,next)=>{
    // review validations
    let {error} = reviewSchema.validate(req.body);
    if(error){
        console.log(error);
        
        errMsg = error.details.map((el) => el.message).join(",");   
        throw new ExpressError(400, errMsg);
    }
    next();
}
// Reviews module
router.post("/",validateReview,wrapAsync(async(req,res)=>{
    console.log(req.params.id);
    
    let listing = await Listing.findById(req.params.id);
    // console.log(req.body.review);
    console.log(listing);
    
    let review = new Review(req.body.review);
    // console.log(review);
    
    listing.reviews.push(review);
    await review.save();
    await listing.save();
    req.flash("success","New Review Created!");
    res.redirect(`/listing/${listing._id}`);
}))
// reviews delete route
router.delete("/:reviewId",wrapAsync(async(req,res)=>{
    let {id ,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listing/${id}`);
}))

module.exports = router;
