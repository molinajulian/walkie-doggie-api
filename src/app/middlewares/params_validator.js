const { checkSchema, validationResult } = require('express-validator');
const { invalidParams } = require('../errors/builders');

const formatValidationErrors = validationErrors =>
  validationErrors.array({ onlyFirstError: true }).map(({ msg }) => msg);

const throwValidationErrors = (req, _, next) => {
  const validationErrors = validationResult(req);
  return next(!validationErrors.isEmpty() && invalidParams(formatValidationErrors(validationErrors)));
};

exports.validateSchema = schema => checkSchema(schema);

exports.validateSchemaAndFail = schema => [exports.validateSchema(schema), throwValidationErrors];
