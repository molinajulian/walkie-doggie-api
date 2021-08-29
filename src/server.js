const app = require('./app');
const { port } = require('./config').server;
const logger = require('./app/logger');
const migrationsManager = require('./migrations');
const redisQueue = require('./redis/queue');

Promise.resolve()
  .then(() => migrationsManager.check())
  .then(() => redisQueue.init())
  .then(() => {
    app.listen(port);
    logger.info(`Listening on port: ${port}`);
  })
  .catch(error => {
    logger.error(error);
  });
