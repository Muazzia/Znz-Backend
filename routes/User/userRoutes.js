const express = require("express");
const userRoutes = express.Router();
const { forgotPassword, setPassword, userDashboard, logout, additionalUserDetails } = require("../../controller/User/userController")
const { checkJWT } = require("../../middleware/authenticationMiddleware");
const checkPreviousToken = require("../../middleware/previousToken");



userRoutes.route("/forgot-password").patch(forgotPassword);
userRoutes.route("/set-password/:email").patch(setPassword);
userRoutes.route("/dashboard").get(checkJWT, checkPreviousToken, userDashboard)
userRoutes.route("/logout").post(checkJWT, logout);
userRoutes.route("/add-details").post(checkJWT, additionalUserDetails);
module.exports = userRoutes