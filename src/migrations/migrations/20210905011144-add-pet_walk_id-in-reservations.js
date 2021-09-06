'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('reservations', 'pet_walk_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'pet_walks',
        key: 'id',
      },
      allowNull: true,
    }),
  down: (queryInterface, Sequelize) => queryInterface.removeColumn('reservations', 'pet_walk_id'),
};
