const { Router: createRouter } = require('express');

const petWalkController = require('../controllers/pet_walk');
const { checkTokenAndSetUser } = require('../middlewares/users');
const { validateSchemaAndFail } = require('../middlewares/params_validator');
const { doPetWalkInstructionSchema } = require('../schemas/pet_walks');

const centersRouter = createRouter();

exports.init = app => {
  app.use('/pet-walks', centersRouter);
  centersRouter.patch(
    '/:pet_walk_id/instructions/:pet_walk_instruction_id',
    [validateSchemaAndFail(doPetWalkInstructionSchema), checkTokenAndSetUser],
    petWalkController.doPetWalkInstruction,
  );
};
