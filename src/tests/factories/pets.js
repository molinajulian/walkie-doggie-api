const { factory } = require('factory-girl');

const { factoryWithCustomizedValue } = require('./factory_by_models');

const modelName = 'Pet';

factoryWithCustomizedValue(modelName);

module.exports = {
  createPet: pet => factory.create(modelName, pet),
  buildPet: pet => factory.build(modelName, pet),
};
