const { inspect } = require('util');

const logger = require('../logger');

exports.logRequests = (req, _, next) => {
  logger.info(
    `New request in ${req.path} with method ${req.method} with params: ${inspect(
      req.params,
    )}, body: ${inspect(req.body)} and query: ${inspect(req.query)}`,
  );
  next();
};
