const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const{ isLoggedIn } = require("../middlewares.js");
const{ isOwner } = require("../middlewares.js");
const router = express.Router();
const multer  = require('multer')
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage })


// controller code
const listingController = require("../controllers/listings.js");

const validateListing  = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error) {
        let errorMessage = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errorMessage);
    }
    else{
        next();
    }
};

// INDEX ROUTE
router.get("/", wrapAsync(listingController.index));

// CREATE ROUTE
router.get("/new", isLoggedIn, listingController.newRouteForm);

router.post("/", isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingController.newRoutePost));
// router.post("/", , (req, res) => {
//     res.send(req.file); // req.file mein file related poora data store hota hai
// });

// SHOW ROUTE
router.get("/:id", validateListing, wrapAsync(listingController.show));

// UPDATE ROUTE
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.updateRouteForm));

router.put("/:id",isLoggedIn, isOwner,upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateRoutePut));

router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.destroy));

module.exports = router;