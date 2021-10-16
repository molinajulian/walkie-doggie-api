'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('pet_walk_instructions', {
      id: { autoIncrement: true, primaryKey: true, allowNull: false, type: Sequelize.INTEGER },
      instruction: { type: Sequelize.STRING, allowNull: false },
      pet_walk_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'pet_walks', key: 'id' } },
      pet_id: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'pets', key: 'id' } },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    }),
  down: queryInterface => queryInterface.dropTable('pet_walk_instructions'),
};
