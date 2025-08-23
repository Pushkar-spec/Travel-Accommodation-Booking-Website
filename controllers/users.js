const User = require("../models/user.js");


module.exports.signup = async(req, res) => {
    try{
        let { username, email, password} = req.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if(err) {
                return next(err);
            }
            req.flash("success", "Welcome to WanderLust!");
            res.redirect("/listings");
        });
        console.log(registeredUser);
    }catch(err) {
        req.flash("error",err.message);
        res.redirect("/signup");
    }
};

module.exports.login = async(req, res) => {
        req.flash("success", "Welcome to WanderLust!");
        // agr aese hi redirect krwaya to home page se direct login krne k baad /listings pr redirect hone ki jagah
        // ye page not found btayaga, kyuki kyuki usLoggedIn middleware trigger nhi hua to res.locals.redirectUrl mein
        // req.originalUrl store bhi nhi hoga to page not found aayega.
        // res.redirect(res.locals.redirectUrl);
        let redirectUrl = res.locals.redirectUrl || "/listings"; // isilye ye krenge
        res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
    req.logout((err) => {
        if(err) {
            next(err);
        }
        req.flash("success", "Logged out successfully!");
        res.redirect("/listings");
    });
};