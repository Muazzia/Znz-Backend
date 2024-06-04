const express = require("express");
const postRouter = express.Router();
const { addingPost, myPost, allPosts, delPost, userPost, singlePost } = require("../../controller/Post/postController");
const { handleMulterUpload } = require("../../middleware/multer")
const checkExistingToken = require("../../middleware/previousToken");
const { checkJWT } = require("../../middleware/authenticationMiddleware");

// postRouter.route("/add-post").post(checkExistingToken, checkJWT, handleMulterUpload("images", false, 10), addingPost);
// postRouter.route("/my-posts").get(checkExistingToken, checkJWT, myPost);
// postRouter.route('/all-posts').get(checkExistingToken, checkJWT, allPosts)
// postRouter.route('/del-post/:id').delete(checkExistingToken, checkJWT, delPost)



postRouter.get("/", allPosts)
postRouter.get("/my-posts", myPost);
postRouter.get('/user-posts/:email', userPost)
postRouter.get('/:id', singlePost)

postRouter.post("/", handleMulterUpload("images", false, 10, false), addingPost);
postRouter.delete("/:id", delPost)


module.exports = postRouter;
