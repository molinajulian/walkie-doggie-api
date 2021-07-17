const { healthCheck } = require('../controllers/health_check');
const usersRouter = require('./users');
const sessionsRouter = require('./sessions');

exports.init = app => {
  app.get('/health', healthCheck);
  const routes = [usersRouter, sessionsRouter];
  routes.forEach(route => route.init(app));
};
