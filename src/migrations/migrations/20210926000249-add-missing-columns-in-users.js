'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    Promise.all([
      queryInterface.addColumn('users', 'pet_walks_amount', {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      }),
    ]),
  down: queryInterface => Promise.all([queryInterface.removeColumn('users', 'pet_walks_amount')]),
};
