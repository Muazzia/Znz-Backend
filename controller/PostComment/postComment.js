const { validateCommentSchema, validateGetAllSchema } = require("../../joiSchemas/PostComment/postComment");
const commentModel = require("../../models/commentModel");
const postModel = require("../../models/postModel");

const getAllComments = async (req, res) => {
    try {
        const { error, value } = validateGetAllSchema(req.body)
        if (error) return res.status(400).send(error.message)

        const postID = value.postId
        const comments = await commentModel.findAll({
            where: {
                isDeleted: false,
                postID
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

        const comment = await commentModel.create({ commentText: value.commentText, userEmail: req.userEmail, postID: value.postID })

        return res.status(201).send(comment)

    } catch (error) {
        console.log(error);
        return res.status(500).send("Server Error")
    }
}

const deleteComment = async (req, res) => {
    try {
        const commentId = req.params.Id
        const comment = await commentModel.findByPk(commentId);
    } catch (error) {
        return res.status(500).send('Server Error')
    }
}


module.exports = { getAllComments, createComment }