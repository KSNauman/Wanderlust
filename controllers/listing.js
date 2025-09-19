const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError");


module.exports.index = async(req,res)=>{
    let Allposts = await Listing.find({});
    res.render("listings/index",{Allposts});
}

module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs");
}

module.exports.showListing = async (req,res)=>{
    let {id} = req.params;
    let post = await Listing.findById(id).populate({path:"reviews",populate:{ path : "author"}}).populate("owner");
    if(!post){
        req.flash("error","Listing you requested is Not Found");
        res.redirect("/listing");
        return;
    }
    res.render("listings/show.ejs",{post});
}

module.exports.createListing = async (req,res)=>{
    let newListing = new Listing(req.body.listing);

    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect(`/listing/${newListing.id}`);
}

module.exports.renderEditForm = async (req,res)=>{
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
}

module.exports.updateListing =async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You're not the owner");
        return res.redirect(`/listing/${id}`);
    }

    let updatedListing = await Listing.findByIdAndUpdate(id,req.body.listing , {new:true});
    
    if (!updatedListing) {
        throw new ExpressError(404,"Listing not found");        
    }
    req.flash("success","Listing Updated!");
    res.redirect(`/listing/${id}`);
}

module.exports.destroyListing = async (req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    res.redirect("/listing");
}