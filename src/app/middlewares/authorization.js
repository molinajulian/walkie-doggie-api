const { notFound, invalidToken } = require('../errors/builders');
const { getUserBy } = require('../services/users');
const { verifyAccessToken } = require('../services/sessions');

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
