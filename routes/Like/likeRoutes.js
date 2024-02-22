const express = require("express");
const likeRoutes = express.Router();
const { likePost } = require("../../controller/Like/likeController");

likeRoutes.route("/").post(likePost);

module.exports = likeRoutes;
