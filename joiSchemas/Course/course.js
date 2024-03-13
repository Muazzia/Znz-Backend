const Joi = require('joi')

const createCourseSchema = Joi.object({
    parentCategory: Joi.string().required(),
    subCategories: Joi.array().required(),
    title: Joi.string().max(255).required(),
    mode: Joi.string().valid('online', 'onsite').required(),
    courseDuration: Joi.string().required(),
    classDays: Joi.array().required(),
    classDuration: Joi.string().required(),
    courseFee: Joi.number().integer().min(1).max(2147483000).required(),
    description: Joi.string().max(1000).required(),
    // status: Joi.string().valid("pending", "accepted").required(),
})

const validateCreateCourse = (body) => {
    return createCourseSchema.validate(body)
}

module.exports = { validateCreateCourse }