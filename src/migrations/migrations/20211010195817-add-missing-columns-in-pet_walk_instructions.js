'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    Promise.all([
      queryInterface.addColumn('pet_walk_instructions', 'address_latitude', {
        type: Sequelize.STRING,
        allowNull: false,
      }),
      queryInterface.addColumn('pet_walk_instructions', 'address_longitude', {
        type: Sequelize.STRING,
        allowNull: false,
      }),
      queryInterface.addColumn('pet_walk_instructions', 'address_description', {
        type: Sequelize.STRING,
        allowNull: false,
      }),
      queryInterface.addColumn('pet_walk_instructions', 'order', {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      }),
    ]),
  down: queryInterface =>
    Promise.all([
      queryInterface.removeColumn('pet_walk_instructions', 'address_latitude'),
      queryInterface.removeColumn('pet_walk_instructions', 'address_longitude'),
      queryInterface.removeColumn('pet_walk_instructions', 'address_description'),
      queryInterface.removeColumn('pet_walk_instructions', 'order'),
    ]),
};
