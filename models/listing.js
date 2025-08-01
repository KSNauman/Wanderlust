const mongoose = require("mongoose");
const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        filename: String,
        url: {
            type: String,
            default: "https://unsplash.com/photos/a-tiny-church-rests-near-mountains-at-dusk-nyPixv20H7Y",
            set: (v) => v === "" ? "https://unsplash.com/photos/a-tiny-church-rests-near-mountains-at-dusk-nyPixv20H7Y" : v
        }
    },
    price: Number,
    location: String,
    country: String,
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;

