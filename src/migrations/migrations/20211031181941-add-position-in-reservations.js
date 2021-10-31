'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('reservations', 'position', {
      type: Sequelize.INTEGER,
      allowNull: true,
    }),
  down: queryInterface => queryInterface.removeColumn('reservations', 'position'),
};
