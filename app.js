if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
//const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const Session = require("express-session"); 
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
// const { listingSchema, reviewSchema } = require("./schema.js");
// const Review = require("./models/review.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const dbUrl = process.env.ATLASDB_URL;

main().then(() => {
    console.log("Connnected to Database Successfull!");
})
.catch((err) => {
    console.log(err);
});

async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended  : true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
    mongoUrl : dbUrl,
    crypto : {
        secret : process.env.SECRET,
    },
    // agr session mein koi change nhi hua to apne session ko 24hrs baad update krne k liye.
    touchAfter : 24*60*60,
})

store.on("error", () => {
    console.log("ERROR IN MONGO SESSION STORE", err);
});

const sessionOptions = {
    store: store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + (7*24*60*60*1000),
        maxAge : 7*24*60*60*1000,
        httpOnly : true
    },
};

// app.get("/", (req,res) => {
//     res.send("Working.")
// });


app.use(Session(sessionOptions));
app.use(flash());

// configuring strategy for passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); // authenicate method ko usse krenge for authentication.

// user related data ko session mein store krna - serialize
// user related data ko session se delete krna - deserialize
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// CREATING DEMO USER TO CHECK PASSPORT
// app.get("/demouser", async(req, res) => {
//     let fakeUser = new User({
//         email : "student123@gmail.com",
//         username : "sigma101",
//     });
//     let registeredUser = await User.register(fakeUser, "helloworld");
//     res.send(registeredUser);
// });
// register(user, password, cb) Convenience method to
//  register a new user instance with a given password. Checks if username is unique

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user; // for authentication part.
    next();
});

app.use("/listings", listingRouter); // to use express route for the listings!
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);


// app.get("/testListing", async (req,res) => {
//     let sampleListing = new Listing({
//         title : "My new Villa",
//         description : "By the beach",
//         price : 45654,
//         location : "Goa",
//         country : "India",
//     });

//     await sampleListing.save();
//     console.log("Sample saved");
//     res.send("Working.");
// });

app.all(/.*/,(req,res,next) => {
    next(new ExpressError(404,"Page not Found"));
});

// ERROR  HANDLING MIDDLEWARE
app.use((err,req,res,next) => {
    let { status = 500, message = "Something Went Wrong"} = err;
    res.status(status).render("error.ejs", {message});
    // res.status(status).send(message);
});

app.listen(8080, () => {
    console.log("Listening on port 8080.")
});