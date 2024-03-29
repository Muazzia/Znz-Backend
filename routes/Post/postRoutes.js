const express = require("express");
const postRouter = express.Router();
const { addingPost, myPost, allPosts, delPost, userPost } = require("../../controller/Post/postController");
// const { upload } = require("../../middleware/multer");
const { handleFileUpload } = require("../../middleware/multer")
const checkExistingToken = require("../../middleware/previousToken");
const { checkJWT } = require("../../middleware/authenticationMiddleware");

postRouter.route("/add-post").post(checkExistingToken, checkJWT, handleFileUpload, addingPost);
postRouter.route("/my-posts").get(checkExistingToken, checkJWT, myPost);
postRouter.route('/all-posts').get(checkExistingToken, checkJWT, allPosts)
postRouter.route('/del-post/:id').delete(checkExistingToken, checkJWT, delPost)


postRouter.get("/", allPosts)
postRouter.get("/my-posts", myPost);
postRouter.get('/user-posts/:email', userPost)

postRouter.post("/", handleFileUpload, addingPost);
postRouter.delete("/:id", delPost)


module.exports = postRouter;
