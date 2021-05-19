const Joi = require('joi')

module.exports = Joi.object({
  type: Joi.string().valid('deposit').required(),
  destination: Joi.number().required(),
  amount: Joi.number().min(0).required(),
})
