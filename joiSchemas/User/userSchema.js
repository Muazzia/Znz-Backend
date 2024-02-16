const Joi = require('joi')

const forgotPassSchema = Joi.object({
    email: Joi.string().email().required()
})

const validateForgotPass = (body) => {
    return forgotPassSchema.validate(body)
}

const setPassSchema = Joi.object({
    password: Joi.string().required().max(255),
    confirmPassword: Joi.string().required().max(255)
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

const changePassword = Joi.object({
    oldPassword: Joi.string().max(255).required(),
    newPassword: Joi.string().max(255).required(),
    confirmPassword: Joi.string().max(255).required()
})

const validateChangePassword = (body) => {
    return changePassword.validate(body)
}


const userData = Joi.object({
    dob: Joi.date(),
    phoneNumber: Joi.string().max(11),
    address: Joi.string().max(255),
    bio: Joi.string().max(255)
})

const validateUserData = (body) => {
    return userData.validate(body)
}


const specialCharacterValidation = Joi.string()
    .custom((value, helpers) => {
        if (/[{};"'~!@#$%^&*()_+=123456789/*\-+]/.test(value)) {
            return helpers.error('any.invalid');
        }
        return value;
    }, 'customValidation');
const userPersonalInfoUpdateSchema = Joi.object({
    firstName: specialCharacterValidation.required().min(3).max(255)
        .messages({
            'any.invalid': "Special characters or numeric values are not allowed in firstName.",
        }),
    lastName: specialCharacterValidation.required().min(3).max(255)
        .messages({
            'any.invalid': "Special characters or numeric values are not allowed in LastName.",
        }),
})


const validateUserPersonalInfoUpdate = (body) => {
    return userPersonalInfoUpdateSchema.validate(body)
}

module.exports = { validateForgotPass, validateSetPass, validateAdditionalUserData, validateChangePassword, validateUserData, validateUserPersonalInfoUpdate }