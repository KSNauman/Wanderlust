const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const maptoken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: maptoken });

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
    // console.log(post);
    
    if(!post){
        req.flash("error","Listing you requested is Not Found");
        res.redirect("/listing");
        return;
    }
    res.render("listings/show.ejs",{post});
}

module.exports.createListing = async (req,res)=>{
    let newListing = new Listing(req.body.listing);
        let locationInput = newListing.location; // e.g., "nbsbjcvsks , Jaipur , India"
        let parts = locationInput.split(',').map(p => p.trim()).filter(p => p.length > 0);
        if (parts.length < 2) {
            // fallback if user enters without commas
            parts = locationInput.trim().split(' ');
        }
        let lastTwo = parts.slice(-2); // get last two keywords
        let queryForMapbox = lastTwo.join(' ');

    let responds = await geocodingClient.forwardGeocode({
    query: queryForMapbox,
    limit: 1
    })
    .send()

    
    let url = req.file.path;
    let filename = req.file.filename;
    newListing.owner = req.user._id;
    // console.log(url , ".." , filename);
    
    newListing.img.url = url;
    newListing.img.filename = filename;
    newListing.geometry = responds.body.features[0].geometry;
    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect(`/listing/${newListing.id}`);
}

module.exports.renderEditForm = async (req,res)=>{
    let {id} = req.params;
    let post = await Listing.findById(id);

    let orginalImgUrl = post.img.url;
    if(orginalImgUrl.includes("cloudinary")){
        orginalImgUrl = orginalImgUrl.replace("/upload" , "/upload/c_fill,w_200,h_200");
    }
    if (!post) {
        // throw new ExpressError(404,"Listing not found");
        req.flash("error","Listing you requested is Not Found");
        res.redirect("/listing");
        // return;
    }else{
        req.flash("success","Edit Success");
        res.render("listings/edit.ejs",{post , orginalImgUrl});
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
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        updatedListing.img.url = url;
        updatedListing.img.filename = filename;
        await updatedListing.save();
    }

    
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
module.exports.searchListing = async (req,res)=>{
    let {q} = req.query;
    if(!q){
        return res.redirect("/listing");
    }
    let Allposts = await Listing.find({ title: { $regex: q, $options: "i" }});
    res.render("listings/index",{Allposts});
}
module.exports.categoryListing = async(req,res)=>{
    let {categ} = req.params;
    let Allposts = await Listing.find({category:categ})
    
    if(!Allposts || Allposts.length === 0){
        req.flash("error","No Listing Found");
        return res.redirect("/listing");
    }

    res.render("listings/index",{Allposts});
    
}
// module.exports.searchListing = async(req,res)