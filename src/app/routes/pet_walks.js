const { Router: createRouter } = require('express');

const centersController = require('../controllers/centers');
const { checkTokenAndSetUser } = require('../middlewares/users');
const { validateSchemaAndFail } = require('../middlewares/params_validator');
const { listCentersSchema } = require('../schemas/centers');

const centersRouter = createRouter();

exports.init = app => {
  app.use('/pet-walks', centersRouter);
  centersRouter.patch(
    '/:id/instructions/:instruction_id',
    [validateSchemaAndFail(listCentersSchema), checkTokenAndSetUser],
    centersController.listCenters,
  );
};
