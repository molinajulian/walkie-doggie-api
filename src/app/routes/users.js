const { Router: createRouter } = require('express');

const usersController = require('../controllers/users');
const { getUserSchema, editOwnerSchema, editWalkerSchema } = require('../schemas/users');
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
  userRouter.put(
    '/:id/owner',
    [validateSchemaAndFail(editOwnerSchema), checkTokenAndSetUser],
    usersController.editOwner,
  );
  userRouter.put(
    '/:id/walker',
    [validateSchemaAndFail(editWalkerSchema), checkTokenAndSetUser],
    usersController.editWalker,
  );
  userRouter.get('/:id', [validateSchemaAndFail(getUserSchema), checkTokenAndSetUser], usersController.get);
};
