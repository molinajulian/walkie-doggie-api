const { factory } = require('factory-girl');

const { factoryWithCustomizedValue } = require('./factory_by_models');

const modelName = 'Achievement';

factoryWithCustomizedValue(modelName);

module.exports = {
  createAchievement: achievement => factory.create(modelName, achievement),
  buildAchievement: achievement => factory.build(modelName, achievement),
};
