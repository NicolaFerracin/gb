// load all the things we need
var GitHubStrategy = require('passport-github2').Strategy;

// load up the user model
var User = require('../app/models/user');

// expose this function to our app using module.exports
module.exports = function(passport) {

  // Github authentication
  passport.use(new GitHubStrategy({
    clientID: '629246e9c4065fc163af',
    clientSecret: 'bdb0eda5ef3c9fbe4ef7f1f6ade9a34e24f0e297',
    callbackURL: 'https://thawing-woodland-11307.herokuapp.com/auth/github_oauth/callback'
  },
  function(accessToken, refreshToken, profile, done) {
    // find a user whose email is the same as the forms email
    // we are checking to see if the user trying to login already exists
    User.findOne({'githubId' : profile.id}, function(err, user) {
      // if there are any errors, return the error
      if (err) {
        return done(err);
      }
      // check to see if theres already a user with that id
      if (user) {
        return done(null, user);
      } else {
        // if there is no user with that email
        // create the user
        var newUser = new User();
        // set the user's local credentials
        newUser.githubId = profile.id;
        newUser.username = profile.username;
        newUser.accessToken = accessToken;
        // save the user
        newUser.save(function(err) {
          if (err) {
            throw err;
          }
          return done(null, newUser);
        });
      }
    });
  }));

// used to serialize the user for the session
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});



/*
// =========================================================================
// passport session setup ==================================================
// =========================================================================
// required for persistent login sessions
// passport needs ability to serialize and unserialize users out of session

// used to serialize the user for the session
passport.serializeUser(function(user, done) {
done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
User.findById(id, function(err, user) {
done(err, user);
});
});

// =========================================================================
// LOCAL SIGNUP ============================================================
// =========================================================================
// we are using named strategies since we have one for login and one for signup
// by default, if there was no name, it would just be called 'local'
passport.use('local-signup', new LocalStrategy({
// by default, local strategy uses username and password, we will override with email
usernameField : 'email',
passwordField : 'password',
passReqToCallback : true // allows us to pass back the entire request to the callback
},
function(req, email, password, done) {
// asynchronous
// User.findOne wont fire unless data is sent back
process.nextTick(function() {
// find a user whose email is the same as the forms email
// we are checking to see if the user trying to login already exists
User.findOne({ 'local.email' :  email }, function(err, user) {
// if there are any errors, return the error
if (err)
return done(err);

// check to see if theres already a user with that email
if (user) {
return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
} else {

// if there is no user with that email
// create the user
var newUser            = new User();

// set the user's local credentials
newUser.local.email    = email;
newUser.local.password = newUser.generateHash(password);

// save the user
newUser.save(function(err) {
if (err)
throw err;
return done(null, newUser);
});
}

});

});

}));

// =========================================================================
// LOCAL LOGIN =============================================================
// =========================================================================
// we are using named strategies since we have one for login and one for signup
// by default, if there was no name, it would just be called 'local'
passport.use('local-login', new LocalStrategy({
// by default, local strategy uses username and password, we will override with email
usernameField : 'email',
passwordField : 'password',
passReqToCallback : true // allows us to pass back the entire request to the callback
},
function(req, email, password, done) { // callback with email and password from our form

// find a user whose email is the same as the forms email
// we are checking to see if the user trying to login already exists
User.findOne({ 'local.email' :  email }, function(err, user) {
// if there are any errors, return the error before anything else
if (err)
return done(err);

// if no user is found, return the message
if (!user)
return done(null, false, req.flash('loginMessage', 'No user found with this email.')); // req.flash is the way to set flashdata using connect-flash

// if the user is found but the password is wrong
if (!user.validPassword(password))
return done(null, false, req.flash('loginMessage', 'Wrong password.')); // create the loginMessage and save it to session as flashdata

// all is well, return successful user
return done(null, user);
});

}));
*/

};
