const { Router: createRouter } = require('express');

const complaintsController = require('../controllers/complaints');
const { checkTokenAndSetUser } = require('../middlewares/users');
const { validateSchemaAndFail } = require('../middlewares/params_validator');
const { createComplaintSchema } = require('../schemas/complaints');

const complaintRouter = createRouter();

exports.init = app => {
  app.use('/complaints', complaintRouter);
  complaintRouter.post(
    '/',
    [validateSchemaAndFail(createComplaintSchema), checkTokenAndSetUser],
    complaintsController.createComplaint,
  );
  complaintRouter.get('/', [checkTokenAndSetUser], complaintsController.listComplaints);
  complaintRouter.get('/:id', [checkTokenAndSetUser], complaintsController.getComplaint);
};
