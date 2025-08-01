const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));

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


// listings route
app.get("/listing", async(req,res)=>{
    let Allposts = await Listing.find({});
    // console.log(Allposts);
    res.render("listings/index",{Allposts});
})

//new route
app.get("/listing/new", (req,res)=>{
    res.render("listings/new.ejs");
})
/*specific route must be before than parameterized route */
// show route
app.get("/listing/:id", async (req,res)=>{
    let {id} = req.params;
    let post = await Listing.findById(id);
    res.render("listings/show.ejs",{post});
})
// updating the listing
app.post("/listing",async (req,res)=>{
    // console.log(req.body);
    let newListing = new Listing(req.body.listing);
    await newListing.save().then((res)=>{
        console.log("Saved successfully");
    }).catch((err)=>{
        console.log("Error ", err);
    });
    console.log(newListing.id)
    res.redirect(`/listing/${newListing.id}`);
})
// edit route
app.get("/listing/:id/edit", async (req,res)=>{
    let {id} = req.params;
    let post = await Listing.findById(id);
    res.render("listings/edit.ejs",{post});
})
app.put("/listing/:id",(req,res)=>{
    let {id} = req.params;
    // console.log(...req.body.listing);
    Listing.findByIdAndUpdate(id,req.body.listing).then(()=>{
        console.log("Updated successfully");
        res.redirect(`/listing/${id}`);
    }).catch((err)=>{
        console.log("Error in updating ", err);
        res.redirect(`/listing/${id}/edit`);
    })
})