const { promisifyAll } = require('bluebird');
const { signAsync } = promisifyAll(require('jsonwebtoken'));
const { secret } = require('../../config').session;

module.exports = {
  generateToken: (userId = 1, type = 'access') => signAsync({ sub: userId, token_use: type }, secret)
};
