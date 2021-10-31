'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('pet_walk_instructions', 'done', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    }),
  down: queryInterface => queryInterface.removeColumn('pet_walk_instructions', 'done'),
};
