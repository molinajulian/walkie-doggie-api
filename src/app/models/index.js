const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const config = require('../../config');

const { url, dialect, username, password, port, database, host, logging } = config.database;
const options = { logging: logging.toLowerCase() === 'true', ssl: true };
const connectionString = url || `${dialect}://${username}:${password}@${host}:${port}/${database}`;
const basename = path.basename(__filename);
const db = {};
const sequelize = new Sequelize(connectionString, options);

const requireAllModels = () =>
  fs
    .readdirSync(__dirname)
    .filter(file => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js')
    .forEach(file => {
      const model = sequelize.import(path.join(__dirname, file));
      db[model.name] = model;
    });

const associateModels = () =>
  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) db[modelName].associate(db);
  });

requireAllModels();
associateModels();

db.sequelizeInstance = sequelize;
db.sequelizePackage = Sequelize;

module.exports = db;
