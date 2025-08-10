// models/Listing.js
const mongoose = require("mongoose");

const defaultImg =
  "https://images.unsplash.com/photo-1754597215918-b4b1f113ca77?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  img: {
    type: String,
    default: defaultImg,
    set: (v) => (v === "" ? defaultImg : v),
  },
  price: Number,
  location: String,
  country: String,
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
