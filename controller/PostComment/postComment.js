const { validateCommentSchema, validateGetAllSchema, validateUpdateComment } = require("../../joiSchemas/PostComment/postComment");
const commentModel = require("../../models/commentModel");
const postModel = require("../../models/postModel");

const getAllComments = async (req, res) => {
    try {
        const { error, value } = validateGetAllSchema(req.body)
        if (error) return res.status(400).send(error.message)

        const comments = await commentModel.findAll({
            where: {
                isDeleted: false,
                postId: value.postId,
                isDeleted: false
            }
        })

        return res.send(comments);
    } catch (error) {
        return res.status(500).send('Server Error')
    }

}

const createComment = async (req, res) => {
    try {
        // const postID = req.params.postId

        const { error, value } = validateCommentSchema(req.body)
        if (error) return res.status(400).send(error.message)

        const post = await postModel.findOne({
            where: {
                postID: value.postId
            }
        });

        if (!post) return res.status(404).send('No Post Found')

        const comment = await commentModel.create({ commentText: value.commentText, userEmail: req.userEmail, postId: value.postId })

        return res.status(201).send(comment)

    } catch (error) {
        console.log(error);
        return res.status(500).send("Server Error")
    }
}

const deleteComment = async (req, res) => {
    try {
        const commentId = req.params.id
        const comment = await commentModel.findByPk(commentId);

        if (!comment) return res.status(404).send('Comment not found');

        await comment.update({
            isDeleted: true
        })

        return res.status(200).send('Deleted Successfully')
    } catch (error) {
        return res.status(500).send('Server Error')
    }
}

const updateCommentText = async (req, res) => {
    try {
        const { error, value } = validateUpdateComment(req.body)
        if (error) return res.status(400).send(error.message)

        const commentId = req.params.id;

        const comment = await commentModel.findOne({
            where: {
                commentId,
                isDeleted: false
            }
        })

        if (!comment) return res.status(404).send('Comment Not Found')

        await comment.update({
            commentText: value.commentText
        })

        return res.status(200).send(comment)
    } catch (error) {
        return res.status(500).send('Server Error')
    }
}


module.exports = { getAllComments, createComment, deleteComment, updateCommentText }