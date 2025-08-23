const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema ({
    email : {
        type : String,
        required : true, 
    }
    // username, password passwordlocalmongoose apne aap add krdega to schema.
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', userSchema);