const Joi = require('joi');
const { allowedDomains } = require('../Auth/auth');



const updateUserSchema = Joi.object({
    isBlocked: Joi.boolean().required(),
    userEmail: Joi.string().required()
})

const validateAdminUpdateUser = (body) => {
    return updateUserSchema.validate(body)
}


module.exports = { validateAdminUpdateUser }