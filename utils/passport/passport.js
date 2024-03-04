const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const userModel = require("../../models/userModel");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.client_ID_google,
      clientSecret: process.env.client_secret_google,
      callbackURL: "http://localhost:8080/api/auth/user/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if the user with this Google ID already exists in the database
        const firstName = profile.name.firstName;
        const lastName = profile.name.familyName;
        const profilePic = profile.photos[0].value
        const email = profile.emails[0].value

        let user = await userModel.findByPk(email);

        if (!user) {
          // If the user doesn't exist, create a new user in the database
          user = await userModel.create({
            googleUser: profile.id,
            email,
            firstName,
            lastName,
            profilePic
          });
        }

        // Call done with the user object to indicate successful authentication
        // console.log(user);
        return done(null, user);
      } catch (error) {
        // Handle error
        console.error('Error in Google authentication:', error);
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});
