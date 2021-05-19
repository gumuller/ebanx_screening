const Joi = require('joi')

module.exports = Joi.object({
  type: Joi.string().valid('transfer').required(),
  origin: Joi.number().required(),
  destination: Joi.number().required(),
  amount: Joi.number().min(0).required(),
})
