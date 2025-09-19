const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const {isLoggedIn , isAuthor,validateReview} = require("../middleware");
const reviewsController = require("../controllers/reviews");


// Reviews module
router.post("/",
    isLoggedIn,
    validateReview,
    wrapAsync(reviewsController.createReview))

// reviews delete route
router.delete("/:reviewId",
    isLoggedIn,
    isAuthor,
    wrapAsync(reviewsController.destroyReview))

module.exports = router;
