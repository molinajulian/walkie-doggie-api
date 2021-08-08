const { Address } = require('../models');

exports.createAddress = async ({ data, options }) => {
  return Address.create(data, options);
};
