'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    Promise.all([
      queryInterface.addColumn('users', 'address_id', {
        type: Sequelize.INTEGER,
        references: {
          model: 'addresses',
          key: 'id',
        },
        allowNull: true,
      }),
      queryInterface.addColumn('users', 'profile_photo_uri', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn('users', 'phone', { type: Sequelize.STRING, allowNull: true }),
      queryInterface.addColumn('users', 'score', { type: Sequelize.DOUBLE, allowNull: true }),
      queryInterface.addColumn('users', 'is_promoted', {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      }),
      queryInterface.addColumn('users', 'cover_letter', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn('users', 'price_per_hour', {
        type: Sequelize.DOUBLE,
        allowNull: true,
      }),
      queryInterface.addColumn('users', 'was_onboarded', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      }),
    ]),
  down: (queryInterface, Sequelize) =>
    Promise.all([
      queryInterface.removeColumn('users', 'address_id'),
      queryInterface.removeColumn('users', 'profile_photo_uri'),
      queryInterface.removeColumn('users', 'phone'),
      queryInterface.removeColumn('users', 'score'),
      queryInterface.removeColumn('users', 'is_promoted'),
      queryInterface.removeColumn('users', 'cover_letter'),
      queryInterface.removeColumn('users', 'price_per_hour'),
    ]),
};
