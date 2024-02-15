const express = require("express");
const userRoutes = express.Router();

const { forgotPassword, setPassword, userDashboard, logout, additionalUserDetails, addProfilePic, getUserExtraDetails, changePassword, addCoverPic, addUserDetails } = require("../../controller/User/userController")
const { checkJWT } = require("../../middleware/authenticationMiddleware");
const checkPreviousToken = require("../../middleware/previousToken");
const { handleProfileUpload, handleCoverUpload } = require("../../middleware/multer");



userRoutes.route("/forgot-password").patch(forgotPassword);
userRoutes.route("/setnew-password").patch(checkPreviousToken, checkJWT, setPassword);
userRoutes.route('/change-password').patch(checkPreviousToken, checkJWT, changePassword)

userRoutes.route("/dashboard").get(checkJWT, checkPreviousToken, userDashboard)
userRoutes.route("/logout").post(checkPreviousToken, checkJWT, logout);

userRoutes.route("/add-details").post(checkPreviousToken, checkJWT, additionalUserDetails);
userRoutes.route('/user-extradetails').get(checkPreviousToken, checkJWT, getUserExtraDetails)
userRoutes.route('/user-details').patch(checkPreviousToken, checkJWT, addUserDetails)


userRoutes.route('/profilepic').patch(checkPreviousToken, checkJWT, handleProfileUpload, addProfilePic)
userRoutes.route('/coverPic').patch(checkPreviousToken, checkJWT, handleCoverUpload, addCoverPic)


module.exports = userRoutes