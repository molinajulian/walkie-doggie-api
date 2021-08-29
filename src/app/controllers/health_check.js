const { queue } = require('../../redis/queue');
exports.healthCheck = async (_, res) => {
  await queue().add('jobsito', { ke: 'onda' });
  res.status(200).send({ uptime: process.uptime() });
};
