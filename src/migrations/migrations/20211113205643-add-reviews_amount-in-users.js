'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('users', 'reviews_amount', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    }),
  down: queryInterface => queryInterface.removeColumn('users', 'reviews_amount'),
};
