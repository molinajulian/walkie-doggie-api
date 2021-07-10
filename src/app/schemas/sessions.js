const { authorization } = require('./utils');
const { email, password, refreshToken } = require('../errors/schema_messages');

exports.loginSchema = {
  email: { in: ['body'], isString: true, trim: true, isEmail: true, errorMessage: email },
  password: { in: ['body'], isString: true, errorMessage: password }
};

exports.refreshSchema = {
  ...authorization,
  refresh_token: {
    in: ['body'],
    isJWT: true,
    trim: true,
    errorMessage: refreshToken
  }
};
