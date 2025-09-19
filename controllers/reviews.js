const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async(req,res)=>{
    console.log(req.params.id);
    
    let listing = await Listing.findById(req.params.id);
    let review = new Review(req.body.review);
    console.log(review);
    review.author = req.user._id;
    listing.reviews.push(review);
    await review.save();
    await listing.save();
    req.flash("success","New Review Created!");
    res.redirect(`/listing/${listing._id}`);
}

module.exports.destroyReview = async(req,res)=>{
    let {id ,reviewId} = req.params;
    
    await Listing.findByIdAndUpdate(id,{$pull:{reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listing/${id}`);
}