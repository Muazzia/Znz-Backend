const Joi = require('joi')


const allowedDomains = [
    "gmail.com",
    "yahoo.com",
    "hotmail.com",
    "icloud.com",
    "outlook.com",
];


const specialCharacterValidation = Joi.string()
    .custom((value, helpers) => {
        if (/[{};"'~!@#$%^&*()_+=123456789/*\-+]/.test(value)) {
            return helpers.error('any.invalid');
        }
        return value;
    }, 'customValidation');

const registerSchema = Joi.object({
    firstName: specialCharacterValidation.required().min(3).max(255)
        .messages({
            'any.invalid': "Special characters or numeric values are not allowed in firstName.",
        }),
    lastName: specialCharacterValidation.required().min(3).max(255)
        .messages({
            'any.invalid': "Special characters or numeric values are not allowed in LastName.",
        }),
    email: Joi.string()
        .email({ tlds: { allow: false } }) // Disable top-level domain (tld) validation
        .custom((value, helpers) => {
            const domain = value.split('@')[1];
            if (!allowedDomains.includes(domain)) {
                return helpers.message(`Email domain must be one of: ${allowedDomains.join(', ')}`);
            }
            return value;
        }, 'customValidation').required().max(255),
    password: Joi.string().max(255).required()
})

const validateRegister = (body) => {
    return registerSchema.validate(body)
}

const loginSchema = Joi.object({
    email: Joi.string().email().required().max(255),
    password: Joi.string().required().max(255)
})

const validateLogin = (body) => {
    return loginSchema.validate(body)
}

module.exports = { validateRegister, validateLogin }