const Joi = require('joi')

const addPostSchema = Joi.object({
    postText: Joi.string().required().max(255),
    interests:Joi.array().required()
})

const validateAddPost = (body) => {
    return addPostSchema.validate(body)
}

module.exports = validateAddPost