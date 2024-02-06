const Joi = require('joi')

const forgotPassSchema = Joi.object({
    email: Joi.string().email().required()
})

const validateForgotPass = (body) => {
    return forgotPassSchema.validate(body)
}

const setPassSchema = Joi.object({
    password: Joi.string().required().max(255),
    confirmPasswrod: Joi.string().required().max(255)
})

const validateSetPass = (body) => {
    return setPassSchema.validate(body)
}

// country, language, gender, interests
const additionalUserDataSchema = Joi.object({
    country: Joi.string().required().max(255),
    language: Joi.string().required().max(255),
    gender: Joi.string().required().valid('male', 'female', 'other'),
    interests: Joi.array().items(Joi.string()).required()
})

const validateAdditionalUserData = (body) => {
    return additionalUserDataSchema.validate(body)
}

module.exports = { validateForgotPass, validateSetPass, validateAdditionalUserData }