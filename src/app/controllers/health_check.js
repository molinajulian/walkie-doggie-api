const Queue = require('bull');
const { redis } = require('../../config');

exports.healthCheck = async (_, res) => {
  const queue = await new Queue('work', redis.url);
  await queue().add();
  return res.status(200).send({ uptime: process.uptime() });
};
