const express = require("express");
const userRoutes = express.Router();

const { forgotPassword, setPassword, userDashboard, logout, additionalUserDetails, addProfilePic, getUserExtraDetails, changePassword, addCoverPic } = require("../../controller/User/userController")
const { checkJWT } = require("../../middleware/authenticationMiddleware");
const checkPreviousToken = require("../../middleware/previousToken");
const { handleProfileUpload, handleCoverUpload } = require("../../middleware/multer");



userRoutes.route("/forgot-password").patch(forgotPassword);
userRoutes.route("/setnew-password").patch(checkJWT, setPassword);
userRoutes.route('/change-password').patch(checkJWT, changePassword)

userRoutes.route("/dashboard").get(checkJWT, checkPreviousToken, userDashboard)
userRoutes.route("/logout").post(checkJWT, logout);
userRoutes.route("/add-details").post(checkJWT, additionalUserDetails);
userRoutes.route('/user-details').get(checkJWT, getUserExtraDetails)
userRoutes.route('/profilepic').patch(checkJWT, handleProfileUpload, addProfilePic)
userRoutes.route('/coverPic').patch(checkJWT, handleCoverUpload, addCoverPic)


module.exports = userRoutes