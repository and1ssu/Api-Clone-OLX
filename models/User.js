const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

mongoose.Promise = global.Promise;

const userSchema = new mongoose.Schema({
    name:String,
    email:String,
    resetPassowrdToken:String,
    resetPassowrdExpires:Date
});

userSchema.plugin(passportLocalMongoose, { usernameField:'email' });

module.exports = mongoose.model('User', userSchema);