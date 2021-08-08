const { promisifyAll } = require('bluebird');
const { signAsync } = promisifyAll(require('jsonwebtoken'));
const { secret } = require('../../config').session;

module.exports = {
  generateToken: (userId = 1, type = 'access', exp = Math.floor(Date.now() / 1000) + 60 * 60) =>
    signAsync({ sub: userId, token_use: type, exp }, secret),
};
