const { objectToSnakeCase } = require('../utils/objects');

const commonSerializer = tokens => objectToSnakeCase(tokens);

exports.login = commonSerializer;

exports.refresh = commonSerializer;
