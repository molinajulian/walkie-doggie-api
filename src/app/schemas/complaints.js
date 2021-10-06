const { authorization } = require('./utils');
const { complaintDescription, complaintFileUris, complaintFileUrisDescription } = require('../errors/schema_messages');

exports.createComplaintSchema = {
  ...authorization,
  description: {
    in: ['body'],
    isString: true,
    trim: true,
    errorMessage: complaintDescription,
  },
  file_uris: {
    in: ['body'],
    isArray: true,
    toArray: true,
    optional: true,
    errorMessage: complaintFileUris,
  },
  'file_uris.*': {
    in: ['body'],
    isString: true,
    trim: true,
    errorMessage: complaintFileUrisDescription,
  },
};
