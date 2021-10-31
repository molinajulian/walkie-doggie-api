exports.healthCheck = async (_, res) => {
  return res.status(200).send({ uptime: process.uptime() });
};
