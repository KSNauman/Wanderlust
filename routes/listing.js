const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const {isLoggedIn , isOwner , validateListing,searchListing} = require("../middleware");
const listingController = require("../controllers/listing");

const multer  = require('multer')
const {storage} = require("../cloudConfig");
const upload = multer({storage});

// listings route
router.get("/",
    wrapAsync(listingController.index))

//new route
router.get("/new",
    isLoggedIn,
    listingController.renderNewForm)

// search route
router.get("/search",wrapAsync(listingController.searchListing))

// category route 
router.get("/category/:categ",wrapAsync(listingController.categoryListing))

// show route , update listing route , delete route
router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn,
        isOwner,
        upload.single('listing[img]'),
        validateListing,wrapAsync(listingController.updateListing))
    .delete(isLoggedIn,
        isOwner,
        wrapAsync(listingController.destroyListing))

// create route
router.post("/",
    isLoggedIn,
    upload.single('listing[img]'),
    validateListing,
    wrapAsync(listingController.createListing)
    )

// edit route
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.renderEditForm))



module.exports = router;