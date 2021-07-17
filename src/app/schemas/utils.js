const { authorization } = require('../errors/schema_messages');

exports.authorization = {
  Authorization: {
    in: ['headers'],
    isJWT: true,
    trim: true,
    errorMessage: authorization
  }
};
