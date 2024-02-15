const Joi = require('joi');


const schema = Joi.object({
    postId: Joi.string().required().max(255)
})

const validateLike = (body) => {
    return schema.validate(body)
}

module.exports = validateLike