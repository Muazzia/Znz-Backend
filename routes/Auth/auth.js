const express = require("express");
const authRoutes = express.Router();
const { registerUser, loginUser, googleLoginPage, authGoogle, googleCallback, verifyEmail, resendEmail } = require("../../controller/Auth/authController");


authRoutes.route("/register-user").post(registerUser);
authRoutes.route('/verify-email').get(verifyEmail)
authRoutes.route('/resend-email').get(resendEmail)

authRoutes.route("/login").post(loginUser);
authRoutes.route("/google/login").get(googleLoginPage);
authRoutes.route("/auth/google").get(authGoogle);
authRoutes.route("/auth/google/callback").get(googleCallback)


module.exports = authRoutes