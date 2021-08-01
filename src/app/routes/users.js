const { Router: createRouter } = require('express');

const usersController = require('../controllers/users');
const { createUserSchema, onBoardingWalkerSchema } = require('../schemas/users');
const { validateSchemaAndFail } = require('../middlewares/params_validator');
const { checkUserOwnerOnBoarding, checkUserWalkerOnBoarding } = require('../middlewares/users');

const userRouter = createRouter();

exports.init = app => {
  app.use('/users', userRouter);
  userRouter.post('/', [validateSchemaAndFail(createUserSchema)], usersController.createUser);
  // TODO: set schema validator in the following endpoints
  userRouter.put(
    '/onboarding/walker/:id',
    [validateSchemaAndFail(onBoardingWalkerSchema), checkUserWalkerOnBoarding],
    usersController.onBoardingWalker,
  );
  userRouter.put('/onboarding/owner/:id', [checkUserOwnerOnBoarding], usersController.onBoardingOwner);
};
