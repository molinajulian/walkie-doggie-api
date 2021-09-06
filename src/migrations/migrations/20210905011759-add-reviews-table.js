'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('reviews', {
      id: { autoIncrement: true, primaryKey: true, allowNull: false, type: Sequelize.INTEGER },
      owner_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'users', key: 'id' } },
      pet_walk_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'pet_walks', key: 'id' } },
      score: { type: Sequelize.INTEGER, allowNull: false },
      description: { type: Sequelize.STRING, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    }),
  down: queryInterface => queryInterface.dropTable('reviews'),
};
