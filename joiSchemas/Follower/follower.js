const Joi = require('joi')

const createFollwerSchema = Joi.object({
    followingEmail: Joi.string().required().max(255)
})

const validateCreateFollower = (body) => {
    return createFollwerSchema.validate(body)
}

const updateFollowStatus = Joi.object({
    email: Joi.string().email().required(),
    status: Joi.valid('accepted', 'rejected').required()
})

const validateUpdateFollowStatus = (body) => {
    return updateFollowStatus.validate(body)
}


module.exports = { validateCreateFollower, validateUpdateFollowStatus }