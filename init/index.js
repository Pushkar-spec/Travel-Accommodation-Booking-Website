const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

main().then(() => {
    console.log("Connnected to Database Successfull!");
})
.catch((err) => {
    console.log(err);
});

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderLust');
}

const initDB = async () => {
    await Listing.deleteMany({});
    const dataWithOwner = initData.data.map((obj) => ({...obj, owner : '68a6cfc53c0ba50a13425f97'})); // add owners individually to each listing.
    // await Listing.insertMany(initData.data);
    await Listing.insertMany(dataWithOwner);
    console.log("Data initialized");
};

initDB();