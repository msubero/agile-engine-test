import * as Joi from "@hapi/joi";

export const transactionSchema = Joi.object({
  id: Joi.number().positive(),
  type: Joi.string().required().valid("credit", "debit"),
  amount: Joi.number().positive().required(),
  effectiveDate: Joi.string(),
});
