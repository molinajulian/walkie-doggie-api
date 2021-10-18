const { listCentersSerializer, centerSerializer } = require('../serializers/centers');
const { listCenters, getCenterById } = require('../services/centers');

exports.listCenters = (req, res, next) =>
  listCenters({ type: req.query.type })
    .then(centers => res.send(listCentersSerializer(centers)))
    .catch(next);

exports.getCenter = (req, res, next) =>
  getCenterById(req.params.id)
    .then(center => res.send(centerSerializer(center)))
    .catch(next);
