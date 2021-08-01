const { notFound, invalidToken, invalidParams } = require('../errors/builders');
const { getUserBy } = require('../services/users');
const { verifyAccessToken } = require('../services/sessions');
const { USER_TYPES } = require('../utils/constants');
exports.checkTokenAndSetUser = (req, _, next) =>
  verifyAccessToken(req.headers.authorization)
    .then(decodedToken => {
      if (decodedToken.token_use !== 'access') {
        return next(invalidToken('The provided token is not an access token'));
      }
      return getUserBy({ id: decodedToken.sub }).then(user => {
        if (!user) return next(notFound('User not found'));
        req.user = user.dataValues;
        return next();
      });
    })
    .catch(err => next(invalidToken(err.message)));

exports.checkUserOwnerOnBoarding = (req, _, next) =>
  getUserBy({ id: req.params.id })
    .then(user => {
      const expectedUserType = USER_TYPES.OWNER;
      if (user.type !== expectedUserType) {
        const errors = [`User must be of type ${expectedUserType}`];
        return next(invalidParams(errors));
      }
      if (user.wasOnboarded) {
        const errors = [`User was already onboarded`];
        return next(invalidParams(errors));
      }
      return next();
    })
    .catch(next);

exports.checkUserWalkerOnBoarding = (req, _, next) =>
  getUserBy({ id: req.params.id })
    .then(user => {
      const expectedUserType = USER_TYPES.WALKER;
      if (user.type !== expectedUserType) {
        const errors = [`User must be of type ${expectedUserType}`];
        return next(invalidParams(errors));
      }
      if (user.wasOnboarded) {
        const errors = [`User was already onboarded`];
        return next(invalidParams(errors));
      }
      return next();
    })
    .catch(next);
