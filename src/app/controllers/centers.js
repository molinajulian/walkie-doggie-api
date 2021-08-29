const { listCentersSerializer } = require('../serializers/centers');
const { listCenters } = require('../services/centers');

exports.listCenters = (req, res, next) =>
  listCenters({ type: req.query.type })
    .then(centers => res.send(listCentersSerializer(centers)))
    .catch(next);
