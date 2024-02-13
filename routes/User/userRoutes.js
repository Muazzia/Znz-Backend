const express = require("express");
const userRoutes = express.Router();

const { forgotPassword, setPassword, userDashboard, logout, additionalUserDetails, addProfilePic, getUserExtraDetails } = require("../../controller/User/userController")
const { checkJWT } = require("../../middleware/authenticationMiddleware");
const checkPreviousToken = require("../../middleware/previousToken");
const { uploadSingle, handleProfileUpload } = require("../../middleware/multer");



userRoutes.route("/forgot-password").patch(forgotPassword);
userRoutes.route("/setnew-password").patch(checkJWT, setPassword);
userRoutes.route("/dashboard").get(checkJWT, checkPreviousToken, userDashboard)
userRoutes.route("/logout").post(checkJWT, logout);
userRoutes.route("/add-details").post(checkJWT, additionalUserDetails);
userRoutes.route('/user-details').get(checkJWT, getUserExtraDetails)
userRoutes.route('/profilepic').patch(checkJWT, handleProfileUpload, addProfilePic)


module.exports = userRoutes