const express = require('express');
const { getAllComments, createComment, deleteComment, updateCommentText } = require('../../controller/PostComment/postComment');
const postCommentR = express.Router();

postCommentR.get('/:id', getAllComments)
postCommentR.post("/", createComment)
postCommentR.delete('/:id', deleteComment)
postCommentR.put('/:id', updateCommentText)


module.exports = postCommentR