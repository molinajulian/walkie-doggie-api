const { minLevel } = require('../../config').logger;
// eslint-disable-next-line import/order
const logger = require('pino')({
  level: minLevel,
  prettyPrint: {
    translateTime: true,
    colorize: true,
  },
});

module.exports = logger;
