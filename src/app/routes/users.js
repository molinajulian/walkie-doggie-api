const { Router: createRouter } = require('express');

const usersController = require('../controllers/users');
const {
  getUserSchema,
  editOwnerSchema,
  editWalkerSchema,
  createFirebaseTokenSchema,
  deleteFirebaseTokenSchema,
} = require('../schemas/users');
const { checkTokenAndSetUser } = require('../middlewares/users');
const { createUserSchema, onBoardingWalkerSchema, onBoardingOwnerSchema } = require('../schemas/users');
const { validateSchemaAndFail } = require('../middlewares/params_validator');
const { checkUserOwnerOnBoarding, checkUserWalkerOnBoarding } = require('../middlewares/users');
const { createFirebaseToken, deleteFirebaseToken } = require('../controllers/users');
const { getReservationsSchema, createReservationSchema } = require('../schemas/reservations');

const userRouter = createRouter();

exports.init = app => {
  app.use('/users', userRouter);
  userRouter.post('/', [validateSchemaAndFail(createUserSchema)], usersController.createUser);
  userRouter.get('/walkers', [checkTokenAndSetUser], usersController.listWalkers);
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
  userRouter.post(
    '/:id/firebase-tokens',
    [validateSchemaAndFail(createFirebaseTokenSchema), checkTokenAndSetUser],
    createFirebaseToken,
  );
  userRouter.delete(
    '/:id/firebase-tokens/:firebase_token',
    [validateSchemaAndFail(deleteFirebaseTokenSchema), checkTokenAndSetUser],
    deleteFirebaseToken,
  );
  userRouter.post(
    '/:id/reservations',
    [validateSchemaAndFail(createReservationSchema), checkTokenAndSetUser],
    usersController.createReservation,
  );
  userRouter.get(
    '/:id/reservations',
    [validateSchemaAndFail(getReservationsSchema), checkTokenAndSetUser],
    usersController.getMyReservations,
  );
  userRouter.get('/:id', [validateSchemaAndFail(getUserSchema), checkTokenAndSetUser], usersController.get);
};
