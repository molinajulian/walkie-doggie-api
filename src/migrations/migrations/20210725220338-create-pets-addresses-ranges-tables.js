'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    Promise.all([
      queryInterface.createTable('addresses', {
        id: {
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
          type: Sequelize.INTEGER,
        },
        description: { type: Sequelize.STRING, allowNull: false },
        latitude: { type: Sequelize.STRING, allowNull: false },
        longitude: { type: Sequelize.STRING, allowNull: false },
        created_at: { type: Sequelize.DATE, allowNull: false },
        updated_at: { type: Sequelize.DATE, allowNull: false },
      }),
      queryInterface.createTable('ranges', {
        id: {
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
          type: Sequelize.INTEGER,
        },
        walker_id: {
          type: Sequelize.INTEGER,
          references: {
            model: 'users',
            key: 'id',
          },
          allowNull: false,
        },
        day_of_week: { type: Sequelize.STRING, allowNull: false },
        start_at: { type: Sequelize.TIME, allowNull: false },
        end_at: { type: Sequelize.TIME, allowNull: false },
        created_at: { type: Sequelize.DATE, allowNull: false },
        updated_at: { type: Sequelize.DATE, allowNull: false },
      }),

      queryInterface.createTable('pets', {
        id: {
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
          type: Sequelize.INTEGER,
        },
        owner_id: {
          type: Sequelize.INTEGER,
          references: {
            model: 'users',
            key: 'id',
          },
          allowNull: false,
        },
        name: { type: Sequelize.STRING, allowNull: false },
        birth_year: { type: Sequelize.INTEGER, allowNull: false },
        breed: { type: Sequelize.STRING, allowNull: false },
        gender: { type: Sequelize.STRING, allowNull: false },
        weight: { type: Sequelize.DOUBLE, allowNull: false },
        description: { type: Sequelize.STRING, allowNull: false },
        photo_uri: { type: Sequelize.STRING, allowNull: false },
        created_at: { type: Sequelize.DATE, allowNull: false },
        updated_at: { type: Sequelize.DATE, allowNull: false },
      }),
    ]),

  down: (queryInterface, Sequelize) =>
    Promise.all([
      queryInterface.dropTable('addresses'),
      queryInterface.dropTable('ranges'),
      queryInterface.dropTable('pets'),
    ]),
};
