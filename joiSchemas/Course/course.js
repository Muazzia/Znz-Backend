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

const updateCourseSchema = Joi.object({
    parentCategory: Joi.string().max(255),
    subCategories: Joi.array().items(Joi.string()).when('parentCategory', {
        is: Joi.exist(),
        then: Joi.required(),
        otherwise: Joi.optional()
    }),
    title: Joi.string().max(255),
    mode: Joi.string().valid('online', 'onsite'),
    courseDuration: Joi.string().max(255),
    classDays: Joi.array(),
    classDuration: Joi.string().max(255),
    courseFee: Joi.number().integer().min(1).max(2147483000),
    description: Joi.string().max(1000),
    deletedImages: Joi.array()
})

const validateUpdateCourse = (body) => {
    return updateCourseSchema.validate(body)
}

module.exports = { validateCreateCourse, validateUpdateCourse }