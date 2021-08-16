const { factory } = require('factory-girl');

const { factoryWithCustomizedValue } = require('./factory_by_models');

const modelName = 'Address';

factoryWithCustomizedValue(modelName);

module.exports = {
  createAddress: address => factory.create(modelName, address),
  buildAddress: address => factory.build(modelName, address),
};
