const express = require("express");
const postRouter = express.Router();
const { addingPost, myPost } = require("../../controller/Post/postController");
// const { upload } = require("../../middleware/multer");
const {handleFileUpload} = require("../../middleware/multer")
const checkExistingToken = require("../../middleware/previousToken");
const { checkJWT } = require("../../middleware/authenticationMiddleware");

postRouter.route("/add-post").post(checkExistingToken,checkJWT,handleFileUpload, addingPost);
postRouter.route("/my-post").get(checkExistingToken, checkJWT, myPost);

module.exports = postRouter;
