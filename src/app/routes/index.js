const { healthCheck } = require('../controllers/health_check');

exports.init = app => {
  app.get('/health', healthCheck);
  const routes = [];
  routes.forEach(route => route.init(app));
};
