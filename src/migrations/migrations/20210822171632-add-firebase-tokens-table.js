'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('firebase_tokens', {
      id: {
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      user_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'users', key: 'id' } },
      token: { type: Sequelize.STRING, allowNull: false },
    }),
  down: queryInterface => queryInterface.dropTable('firebase_tokens'),
};
