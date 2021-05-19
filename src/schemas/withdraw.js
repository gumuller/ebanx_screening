const Joi = require('joi')

module.exports = Joi.object({
  type: Joi.string().valid('withdraw').required(),
  origin: Joi.number().required(),
  amount: Joi.number().min(0).required(),
})
