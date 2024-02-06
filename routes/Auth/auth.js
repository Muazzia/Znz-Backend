const express = require("express");
const authRoutes = express.Router();
const { checkJWT} = require("../../middleware/authenticationMiddleware");
const { registerUser, loginUser, googleLoginPage, authGoogle, googleCallback} = require("../../controller/Auth/authController");


authRoutes.route("/register-user").post(registerUser);
authRoutes.route("/login").post(loginUser);
authRoutes.route("/google/login").get(googleLoginPage);
authRoutes.route("/auth/google").get(authGoogle);
authRoutes.route("/auth/google/callback").get(googleCallback)


module.exports = authRoutes