const { authorization } = require('./utils');
const { centerTypeError } = require('../errors/schema_messages');
const { CENTER_TYPES } = require('../utils/constants');

exports.listCentersSchema = {
  ...authorization,
  type: {
    in: ['query'],
    custom: {
      options: value => Object.values(CENTER_TYPES).includes(value),
    },
    errorMessage: centerTypeError,
  },
};
