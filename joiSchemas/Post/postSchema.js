const Joi = require('joi')

const addPostSchema = Joi.object({
    postText: Joi.string().required().max(255),
})

const validateAddPost = (body) => {
    return addPostSchema.validate(body)
}

module.exports = validateAddPost