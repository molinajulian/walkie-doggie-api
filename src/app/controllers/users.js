const { createUserSerializer } = require('../serializers/users');
const { createUser } = require('../services/users');
const { createUserMapper } = require('../mappers/users');

exports.createUser = (req, res, next) =>
  createUser(createUserMapper(req))
    .then(user => res.status(201).json(createUserSerializer(user)))
    .catch(next);
