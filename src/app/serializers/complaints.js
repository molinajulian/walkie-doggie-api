const { createUserSerializer } = require('./users');

exports.complaintSerializer = complaint => ({
  id: complaint.id,
  description: complaint.description,
  complaint_files:
    (complaint.complaintFiles &&
      complaint.complaintFiles.map(({ id, fileUri }) => ({
        id,
        file_uri: fileUri,
      }))) ||
    [],
  reporter: createUserSerializer(complaint.reporter),
});
