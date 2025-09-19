const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const {isLoggedIn , isOwner , validateListing} = require("../middleware");
const listingController = require("../controllers/listing");


// listings route
router.get("/",
    wrapAsync(listingController.index))

//new route
router.get("/new",
    isLoggedIn,
    listingController.renderNewForm)

/*specific route must be before than parameterized route */
// show route
router.get("/:id",
    wrapAsync(listingController.showListing))

// create route
router.post("",
    validateListing,
    wrapAsync(listingController.createListing))

// edit route
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.renderEditForm))

// update listing route
router.put("/:id",
    isLoggedIn,
    isOwner,
    validateListing,wrapAsync(listingController.updateListing))

// delete route
router.delete("/:id",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.destroyListing))

module.exports = router;