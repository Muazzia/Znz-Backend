const express = require('express');
const { getAllComments, createComment } = require('../../controller/PostComment/postComment');
const postCommentR = express.Router();

postCommentR.get('/', getAllComments)
postCommentR.post("/:postId", createComment)
postCommentR.delete('/:postId',)


module.exports = postCommentR