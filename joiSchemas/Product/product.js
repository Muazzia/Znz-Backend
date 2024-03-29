const Joi = require('joi')

const createProductSchema = Joi.object({
    title: Joi.string().max(255).required(),
    price: Joi.number().integer().min(1).max(2147483000).required(),
    description: Joi.string().max(1000).required(),
    parentCategory: Joi.string().required(),
    subCategories: Joi.array().required(),
});

const validateProduct = (body) => {
    return createProductSchema.validate(body)
}


module.exports = { validateProduct }