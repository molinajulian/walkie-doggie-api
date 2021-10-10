const { sequelizeInstance: sequelize } = require('../models');
const { createComplaintMapper } = require('../mappers/complaints');
const { createComplaint, listComplaints } = require('../services/complaints');
const { complaintSerializer } = require('../serializers/complaints');

exports.createComplaint = (req, res, next) =>
  sequelize
    .transaction(() =>
      createComplaint({
        loggedUser: req.user,
        data: createComplaintMapper(req),
      }).then(complaint => res.status(201).json(complaintSerializer(complaint))),
    )
    .catch(next);

exports.listComplaints = (req, res, next) =>
  listComplaints()
    .then(complaints => res.status(201).json(complaints.map(complaintSerializer)))
    .catch(next);
