// models/Listing.js
const mongoose = require("mongoose");
const Review = require("./review.js");

const defaultImg =
  "https://images.unsplash.com/photo-1754597215918-b4b1f113ca77?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  img: {
    url : String,
    filename : String,
  },
  price: Number,
  location: String,
  country: String,
  reviews :[{
    type : mongoose.Schema.Types.ObjectId,
    ref: "Review"
  }],
  owner : {
    type: mongoose.Schema.Types.ObjectId,
    ref : "User"
  },
  geometry:{
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  category :{
    type:String,
    enum: [
      "Trending",
      "Rooms",
      "Iconic cities",
      "Mountains",
      "Castles",
      "Amazing pools",
      "Camping",
      "Farms",
      "Arctic",
      "Boats"
    ],
    required : true
  }

});

listingSchema.post("findOneAndDelete", async(listing)=>{
  if(listing){
    await Review.deleteMany({_id:{$in:listing.reviews}});
  }
})
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
