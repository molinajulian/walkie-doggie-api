const { DATABASE_ERROR } = require('./internal_codes');

const buildError = (message, internalCode) => ({
  message,
  internalCode
});

exports.databaseError = message => buildError(message, DATABASE_ERROR);
