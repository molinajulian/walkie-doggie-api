const { Router: createRouter } = require('express');

const sessionsController = require('../controllers/sessions');
const { checkRefreshTokenAndSetUser } = require('../middlewares/users');
const { loginSchema, refreshSchema } = require('../schemas/sessions');
const { validateSchemaAndFail } = require('../middlewares/params_validator');

const sessionRouter = createRouter();

exports.init = app => {
  app.use('/sessions', sessionRouter);
  sessionRouter.post('/login', [validateSchemaAndFail(loginSchema)], sessionsController.login);
  sessionRouter.post(
    '/refresh',
    [validateSchemaAndFail(refreshSchema), checkRefreshTokenAndSetUser],
    sessionsController.refresh,
  );
};
