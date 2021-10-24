'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('users', 'allows_tracking', {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    }),
  down: queryInterface => queryInterface.removeColumn('users', 'allows_tracking'),
};
