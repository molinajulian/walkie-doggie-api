const { Router: createRouter } = require('express');

const usersController = require('../controllers/users');
const { createUserSchema } = require('../schemas/users');
const { validateSchemaAndFail } = require('../middlewares/params_validator');

const userRouter = createRouter();

exports.init = app => {
  app.use('/users', userRouter);
  userRouter.post('/', [validateSchemaAndFail(createUserSchema)], usersController.createUser);
};
