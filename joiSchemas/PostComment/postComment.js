const Joi = require('joi')

const createCommentSchema = Joi.object({
    commentText: Joi.string().required().max(255),
    postId: Joi.string().required().max(255)
})

const validateCommentSchema = (body) => {
    return createCommentSchema.validate(body)
}

const getAllCommentSchema = Joi.object({
    postId: Joi.string().required().max(255)
})

const validateGetAllSchema = (body) => {
    return getAllCommentSchema.validate(body)
}

const updateCommentSchema = Joi.object({
    commentText: Joi.string().required().max(255),
})

const validateUpdateComment = (body) => {
    return updateCommentSchema.validate(body)
}

// const 

module.exports = { validateCommentSchema, validateGetAllSchema, validateUpdateComment }