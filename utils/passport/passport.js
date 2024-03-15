const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const userModel = require("../../models/userModel");
const { validateRegister } = require("../../joiSchemas/Auth/auth");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.client_ID_google,
      clientSecret: process.env.client_secret_google,
      callbackURL: "http://localhost:8080/api/auth/user/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {

        const firstName = profile._json.given_name
        const lastName = profile._json.familyName || firstName
        const profilePic = profile._json.picture
        const email = profile._json.email

        let user = await userModel.findByPk(email);
        if (user && user.isEmailVerified) return done(null, user)


        if (!user) {
          console.log(firstName);
          user = await userModel.create({
            googleUser: profile.id,
            email,
            firstName,
            lastName,
            profilePic,
            isEmailVerified: true
          });
        }


        if (!user.isEmailVerified) return done('Email is already registered Please verify It first')
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
