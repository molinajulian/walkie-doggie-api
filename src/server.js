const app = require('./app');
const { port } = require('./config').server;
const logger = require('./app/logger');
const migrationsManager = require('./migrations');

Promise.resolve()
  .then(() => migrationsManager.check())
  .then(() => {
    app.listen(port);
    logger.info(`Listening on port: ${port}`);
  })
  .catch(error => {
    logger.error(error);
  });
