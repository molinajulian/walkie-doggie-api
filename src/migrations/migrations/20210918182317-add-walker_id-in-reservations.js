'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('reservations', 'walker_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
      allowNull: true,
    }),
  down: queryInterface => queryInterface.removeColumn('reservations', 'walker_id'),
};
