const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const router = express.Router({mergeParams : true});
const { isLoggedIn, isReviewAuthor } = require("../middlewares.js");
// mergeParams use krne se app.js mein likha ("app.use("/listings/:is/reviews")") mein jo :id se
// vo iss file tk paas hogi, warna review not found error aayega!!

const reviewController = require("../controllers/reviews.js");

const validateReview  = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error) {
        let errorMessage = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errorMessage);
    }
    else{
        next();
    }
};

// REVIEWS => POST ROUTE
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

// REVIEWS => DELETE ROUTE
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));


module.exports = router;