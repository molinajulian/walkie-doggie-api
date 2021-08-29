const Queue = require('bull');

const { url } = require('../config').redis;

let workQueue = null;

exports.queue = () => workQueue;

exports.init = async () => {
  workQueue = await new Queue('work', url);
};
