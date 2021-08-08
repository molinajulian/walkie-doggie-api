const { Router: createRouter } = require('express');

const usersController = require('../controllers/users');
const { checkTokenAndSetUser } = require('../middlewares/users');
const { createUserSchema, onBoardingWalkerSchema, onBoardingOwnerSchema } = require('../schemas/users');
const { validateSchemaAndFail } = require('../middlewares/params_validator');
const { checkUserOwnerOnBoarding, checkUserWalkerOnBoarding } = require('../middlewares/users');

const userRouter = createRouter();

exports.init = app => {
  app.use('/users', userRouter);
  userRouter.post('/', [validateSchemaAndFail(createUserSchema)], usersController.createUser);
  userRouter.put(
    '/onboarding/walker/:id',
    [validateSchemaAndFail(onBoardingWalkerSchema), checkTokenAndSetUser, checkUserWalkerOnBoarding],
    usersController.onBoardingWalker,
  );
  userRouter.put(
    '/onboarding/owner/:id',
    [validateSchemaAndFail(onBoardingOwnerSchema), checkTokenAndSetUser, checkUserOwnerOnBoarding],
    usersController.onBoardingOwner,
  );
};
