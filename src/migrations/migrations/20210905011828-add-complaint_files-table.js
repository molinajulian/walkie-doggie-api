'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('complaint_files', {
      id: { autoIncrement: true, primaryKey: true, allowNull: false, type: Sequelize.INTEGER },
      complaint_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'complaints', key: 'id' } },
      file_uri: { type: Sequelize.STRING, allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('complaint_files'),
};
