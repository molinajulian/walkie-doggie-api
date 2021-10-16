const Bluebird = require('bluebird');

const logger = require('../logger');
const { inspect } = require('util');
const { Complaint, ComplaintFile, User } = require('../models');
const { databaseError } = require('../errors/builders');
const { getComplaint } = require('./complaints');

exports.createComplaint = async ({ loggedUser, data }) => {
  logger.info(`Attempting to create complaint with attributes: ${inspect(data)}`);
  const complaint = await Complaint.create({ description: data.description, userReporterId: loggedUser.id }).catch(
    error => {
      logger.error('Error creating complaint, reason:', error);
      throw databaseError(error.message);
    },
  );
  let complaintFiles = [];
  if (data.fileUris && data.fileUris.length) {
    const complaintFilesCreationPromises = await Bluebird.Promise.map(data.fileUris, fileUri =>
      ComplaintFile.create({ fileUri, complaintId: complaint.id }),
    );
    complaintFiles = await Promise.all(complaintFilesCreationPromises).catch(error => {
      logger.error('Error creating file uris for complaint, reason:', error);
      throw databaseError(error.message);
    });
  }
  complaint.reporter = loggedUser;
  complaint.complaintFiles = complaintFiles;
  return complaint;
};

exports.listComplaints = () =>
  Complaint.findAll({
    include: [
      { model: User, as: 'reporter', required: true },
      { model: ComplaintFile, as: 'complaintFiles' },
    ],
    order: [['createdAt', 'desc']],
  }).catch(error => {
    logger.error('Error getting complaints, reason:', error);
    throw databaseError(error.message);
  });

exports.getComplaint = id =>
  Complaint.findOne({
    where: { id },
    include: [
      { model: User, as: 'reporter', required: true },
      { model: ComplaintFile, as: 'complaintFiles' },
    ],
  }).catch(error => {
    logger.error('Error getting complaint, reason:', error);
    throw databaseError(error.message);
  });
