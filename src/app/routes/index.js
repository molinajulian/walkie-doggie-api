const { healthCheck } = require('../controllers/health_check');
const usersRouter = require('./users');
const sessionsRouter = require('./sessions');
const centersRouter = require('./centers');
const complaintsRouter = require('./complaints');
const petWalksRouter = require('./pet_walks');

exports.init = app => {
  app.get('/health', healthCheck);
  const routes = [usersRouter, sessionsRouter, centersRouter, complaintsRouter, petWalksRouter];
  routes.forEach(route => route.init(app));
};
