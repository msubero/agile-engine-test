import * as Joi from "@hapi/joi";

export const transactionSchema = Joi.object({
  id: Joi.string(),
  type: Joi.string()
    .required()
    .valid("credit", "debit"),
  amount: Joi.number().required(),
  effectiveDate: Joi.string()
});
