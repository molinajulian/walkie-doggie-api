'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    Promise.all([
      queryInterface.addColumn('reservations', 'total_price', {
        type: Sequelize.INTEGER,
        allowNull: true,
      }),
      queryInterface.addColumn('reservations', 'code', {
        type: Sequelize.STRING,
        allowNull: false,
      }),
    ]),
  down: (queryInterface, Sequelize) =>
    Promise.all([
      queryInterface.removeColumn('reservations', 'total_price'),
      queryInterface.removeColumn('reservations', 'code'),
    ]),
};
