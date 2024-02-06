const express = require("express");
const likeRoutes = express.Router();
const { likePost } = require("../../controller/Like/likeController");
const { checkJWT } = require("../../middleware/authenticationMiddleware");

likeRoutes.route("/like-post").post(checkJWT,likePost);

module.exports = likeRoutes;
