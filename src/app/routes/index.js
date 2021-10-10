const { healthCheck } = require('../controllers/health_check');
const usersRouter = require('./users');
const sessionsRouter = require('./sessions');
const centersRouter = require('./centers');
const complaintsRouter = require('./complaints');

exports.init = app => {
  app.get('/health', healthCheck);
  const routes = [usersRouter, sessionsRouter, centersRouter, complaintsRouter];
  routes.forEach(route => route.init(app));
};
