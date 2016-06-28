// app/models/user.js
// User mongoose mode for authentication with passport.js

var mongoose = require('mongoose');

// define the schema for our user model
var userSchema = mongoose.Schema({
    githubId : Number,
    username : String,
    accessToken : String
});
// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
