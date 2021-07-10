const { USER_TYPES } = require('../utils/constants');

const stringMessage = field => `${field} must be a string`;
const oneOfMessage = (field, values) => `${field} must be one of ${values.join(',')}`;
const containedMessage = location => `and be contained in ${location}`;
const jwtMessage = (field, location = 'headers') =>
  `${field} must be a jwt token and must be contained in ${location}`;

exports.authorization = jwtMessage('Authorization');
exports.firstName = `${stringMessage('first_name')} ${containedMessage('body')}`;
exports.password = `${stringMessage('password')} ${containedMessage('body')}`;
exports.email = `${stringMessage('email')} ${containedMessage('body')}`;
exports.lastName = `${stringMessage('last_name')} ${containedMessage('body')}`;
exports.userType = `${oneOfMessage('type', Object.values(USER_TYPES))} ${containedMessage('body')}`;
