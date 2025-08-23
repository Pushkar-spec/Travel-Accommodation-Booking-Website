const Listing = require("./models/listing.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req, res, next) =>{
    if(!req.isAuthenticated()){
        // redirectUrl save
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You need to login first.")
        return res.redirect("/login");
    }
    next();
};

// login krne k baad passport bydefault ye krta hai ki req.session mein extra cheezon ko
// delete krdeta hai iska mtlb ki agr redirectedUrl pr redirect krwana hai to usko ek
// res.locals mein save krwana pdega as a middleware.
module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async(req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error", "You dont't have permissions");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.isReviewAuthor = async(req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error", "You dont't have permissions");
        return res.redirect(`/listings/${id}`);
    }
    next();
};