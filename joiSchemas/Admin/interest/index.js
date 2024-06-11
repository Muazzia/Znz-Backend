const Joi = require('joi')

const interest = Joi.object({
    name: Joi.string().max(255).required(),

})
const validateInterest = (data) => {
    return interest.validate(data)
}
module.exports = { validateInterest}