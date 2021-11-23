const { Router: createRouter } = require('express');

const petWalkController = require('../controllers/pet_walk');
const reviewsController = require('../controllers/reviews');
const { checkTokenAndSetUser } = require('../middlewares/users');
const { validateSchemaAndFail } = require('../middlewares/params_validator');
const {
  doPetWalkInstructionSchema,
  createReviewSchema,
  petWalkSchema,
  finishPetWalkSchema,
} = require('../schemas/pet_walks');

const petWalkRouter = createRouter();

exports.init = app => {
  app.use('/pet-walks', petWalkRouter);
  petWalkRouter.post(
    '/:pet_walk_id/reviews',
    [validateSchemaAndFail(createReviewSchema), checkTokenAndSetUser],
    reviewsController.createReview,
  );
  petWalkRouter.patch(
    '/:pet_walk_id/instructions/:pet_walk_instruction_id',
    [validateSchemaAndFail(doPetWalkInstructionSchema), checkTokenAndSetUser],
    petWalkController.doPetWalkInstruction,
  );

  petWalkRouter.patch(
    '/:pet_walk_id/finish',
    [validateSchemaAndFail(finishPetWalkSchema), checkTokenAndSetUser],
    petWalkController.finishPetWalk,
  );
};
