const Queue = require('bull');

const { url } = require('../config').redis;

exports.init = async () => new Queue('work', url);
