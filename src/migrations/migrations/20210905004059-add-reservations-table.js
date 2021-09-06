'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('reservations', {
      id: {
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      pet_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'pets',
          key: 'id',
        },
        allowNull: false,
      },
      range_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'ranges',
          key: 'id',
        },
        allowNull: false,
      },
      address_start_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'addresses',
          key: 'id',
        },
        allowNull: false,
      },
      address_end_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'addresses',
          key: 'id',
        },
        allowNull: false,
      },
      reservation_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      duration: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      observations: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    }),
  down: queryInterface => queryInterface.dropTable('reservations'),
};
