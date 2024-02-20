const Joi = require('joi')

const createFollwerSchema = Joi.object({
    followingEmail: Joi.string().required().max(255)
})

const validateCreateFollower = (body) => {
    return createFollwerSchema.validate(body)
}


module.exports = { validateCreateFollower }