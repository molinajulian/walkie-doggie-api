const { firstName, lastName, password, email, userType } = require('../errors/schema_messages');
const { USER_TYPES } = require('../utils/constants');

exports.createUserSchema = {
  first_name: {
    in: ['body'],
    isString: true,
    trim: true,
    isLength: { options: { min: 1 } },
    errorMessage: firstName,
  },
  email: {
    in: ['body'],
    isString: true,
    trim: true,
    isEmail: true,
    isLength: { options: { min: 1 } },
    errorMessage: email,
  },
  password: {
    in: ['body'],
    isString: true,
    errorMessage: password,
    isLength: { options: { min: 1 } },
  },
  last_name: {
    in: ['body'],
    isString: true,
    trim: true,
    errorMessage: lastName,
    isLength: { options: { min: 1 } },
  },
  type: {
    in: ['body'],
    trim: true,
    custom: {
      options: value => Object.values(USER_TYPES).includes(value),
    },
    errorMessage: userType,
  },
};
