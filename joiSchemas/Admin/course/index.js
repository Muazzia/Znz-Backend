const Joi = require('joi')


const courseParentCat = Joi.object({
    name: Joi.string().max(255).required()
})

const validateCreateParentCat = (data) => {
    return courseParentCat.validate(data)
}

const courseSubCat = Joi.object({
    name: Joi.string().max(255).required()
})

const validateCreateSubCat = (data) => {
    return courseSubCat.validate(data)
}


module.exports = { validateCreateParentCat, validateCreateSubCat }