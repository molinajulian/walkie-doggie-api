const { Router: createRouter } = require('express');

const usersController = require('../controllers/users');
const petsController = require('../controllers/pets');
const {
  getUserSchema,
  editOwnerSchema,
  editWalkerSchema,
  createFirebaseTokenSchema,
  deleteFirebaseTokenSchema,
  listWalkerSchema,
} = require('../schemas/users');
const { checkTokenAndSetUser } = require('../middlewares/users');
const { createUserSchema, onBoardingWalkerSchema, onBoardingOwnerSchema } = require('../schemas/users');
const { validateSchemaAndFail } = require('../middlewares/params_validator');
const { checkUserOwnerOnBoarding, checkUserWalkerOnBoarding } = require('../middlewares/users');
const { createFirebaseToken, deleteFirebaseToken } = require('../controllers/users');
const { getReservationsSchema, createReservationSchema } = require('../schemas/reservations');
const { editPetSchema, createPetSchema } = require('../schemas/pets');
const { createPetWalkSchema } = require('../schemas/pet_walks');
const { createPetWalk } = require('../controllers/pet_walk');

const userRouter = createRouter();

exports.init = app => {
  app.use('/users', userRouter);
  userRouter.post('/', [validateSchemaAndFail(createUserSchema)], usersController.createUser);
  userRouter.get(
    '/walkers',
    [validateSchemaAndFail(listWalkerSchema), checkTokenAndSetUser],
    usersController.listWalkers,
  );
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
  userRouter.post(
    '/:id/pets',
    [validateSchemaAndFail(createPetSchema), checkTokenAndSetUser],
    petsController.createPet,
  );
  userRouter.post('/:id/pet-walks', [validateSchemaAndFail(createPetWalkSchema), checkTokenAndSetUser], createPetWalk);
  userRouter.put(
    '/:id/pets/:petId',
    [validateSchemaAndFail(editPetSchema), checkTokenAndSetUser],
    petsController.editPet,
  );
  userRouter.get('/:id', [validateSchemaAndFail(getUserSchema), checkTokenAndSetUser], usersController.get);
};
