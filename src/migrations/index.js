const Umzug = require('umzug');

const { automaticallyUp } = require('./../config').migrations;
const { sequelizeInstance: sequelize } = require('../app/models');
const logger = require('../app/logger');

const getError = () =>
  new Error(
    automaticallyUp
      ? 'There are pending migrations that could not be executed'
      : 'Pending migrations, run: npm run migrations',
  );

const pendingHandle = umzug => {
  if (automaticallyUp) {
    return umzug.up().catch(err => {
      logger.error(err);
      return Promise.reject(getError());
    });
  }
  return Promise.reject(getError());
};

const migrationsParams = [
  sequelize.getQueryInterface(),
  sequelize.constructor,
  () => {
    throw new Error('Migration tried to use old style "done" callback.upgrade');
  },
];

const umzugOptions = {
  logging: console.log,
  storage: 'sequelize',
  storageOptions: { sequelize },
  migrations: {
    params: migrationsParams,
    path: `${__dirname}/migrations`,
    pattern: /\.js$/,
  },
};

exports.check = () => {
  const umzug = new Umzug(umzugOptions);
  return umzug
    .pending()
    .then(migrations => (migrations.length ? pendingHandle(umzug) : Promise.resolve()));
};
