'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('complaints', {
      id: { autoIncrement: true, primaryKey: true, allowNull: false, type: Sequelize.INTEGER },
      user_reporter_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'users', key: 'id' } },
      description: { type: Sequelize.STRING, allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    }),
  down: queryInterface => queryInterface.dropTable('complaints'),
};
