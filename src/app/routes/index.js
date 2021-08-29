const { healthCheck } = require('../controllers/health_check');
const usersRouter = require('./users');
const sessionsRouter = require('./sessions');
const centersRouter = require('./centers');

exports.init = app => {
  app.get('/health', healthCheck);
  const routes = [usersRouter, sessionsRouter, centersRouter];
  routes.forEach(route => route.init(app));
};
