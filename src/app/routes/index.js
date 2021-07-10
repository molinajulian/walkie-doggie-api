const { healthCheck } = require('../controllers/health_check');
const userRouter = require('./users');

exports.init = app => {
  app.get('/health', healthCheck);
  const routes = [userRouter];
  routes.forEach(route => route.init(app));
};
