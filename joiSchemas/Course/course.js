const Joi = require('joi')

const createCourseSchema = Joi.object({
    title: Joi.string().max(255).required(),
    description: Joi.string().max(255).required(),
    details: Joi.string().max(255).required(),
    status: Joi.string().valid("pending", "accepted").required(),
    courseOverview: Joi.string().max(255).required()
})

const validateCreateCourse = (body) => {
    return createCourseSchema.validate(body)
}

module.exports = { validateCreateCourse }