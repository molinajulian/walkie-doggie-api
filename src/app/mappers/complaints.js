exports.createComplaintMapper = req => ({
  description: req.body.description,
  fileUris: req.body.file_uris,
});
