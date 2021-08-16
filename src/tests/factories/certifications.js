const { factory } = require('factory-girl');

const { factoryWithCustomizedValue } = require('./factory_by_models');

const modelName = 'Certification';

factoryWithCustomizedValue(modelName);

module.exports = {
  createCertification: certification => factory.create(modelName, certification),
  buildCertification: certification => factory.build(modelName, certification),
};
