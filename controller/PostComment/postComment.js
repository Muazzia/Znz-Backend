const { validateCommentSchema, validateGetAllSchema, validateUpdateComment } = require("../../joiSchemas/PostComment/postComment");
const commentModel = require("../../models/commentModel");
const postModel = require("../../models/postModel");
const userModel = require("../../models/userModel");

const modifyReturnObject = async (data) => {
    try {
        const newArr = await Promise.all(data.map(async (d) => {
            try {
                const user = await userModel.findByPk(d.dataValues.userEmail)
                if (!user) return {}
                const { firstName, lastName, profilePic, email } = user
                return {
                    ...d.dataValues,
                    user: {
                        firstName,
                        lastName,
                        profilePic,
                        email
                    }
                }
            } catch (error) { }
        }))
        return newArr
    } catch (error) {
        return []
    }
}


const getAllComments = async (req, res) => {
    try {


        const postId = req.params.id
        const comments = await commentModel.findAll({
            where: {
                postId
            }
        })

        const data = await modifyReturnObject(comments)
        return res.send({
            statusCode: 200,
            message: "Comments received Successfully",
            data
        });
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

        await comment.destroy()

        return res.status(200).send({ message: 'Deleted Successfully', comment })
    } catch (error) {
        return res.status(500).send('Server Error')
    }
}

const updateCommentText = async (req, res) => {
    try {
        const { error, value } = validateUpdateComment(req.body)
        if (error) return res.status(400).send(error.message)

        const commentId = req.params.id;

        const comment = await commentModel.findByPk(commentId)

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