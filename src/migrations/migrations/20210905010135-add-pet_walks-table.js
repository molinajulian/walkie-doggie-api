'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('pet_walks', {
      id: { autoIncrement: true, primaryKey: true, allowNull: false, type: Sequelize.INTEGER },
      address_start_id: { type: Sequelize.INTEGER, references: { model: 'addresses', key: 'id' }, allowNull: false },
      status: { type: Sequelize.STRING, allowNull: false },
      start_date: { type: Sequelize.DATE, allowNull: false },
      walker_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'users', key: 'id' } },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    }),
  down: queryInterface => queryInterface.dropTable('pet_walks'),
};
