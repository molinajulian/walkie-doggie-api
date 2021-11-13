'use strict';

module.exports = {
  up: queryInterface =>
    Promise.all([
      queryInterface.sequelize.query('ALTER TABLE "reservations" ADD COLUMN IF NOT EXISTS "total_price" INTEGER;'),
      queryInterface.sequelize.query('ALTER TABLE "reservations" ADD COLUMN IF NOT EXISTS "code" INTEGER;'),
    ]),
  down: queryInterface =>
    Promise.all([
      queryInterface.removeColumn('reservations', 'total_price'),
      queryInterface.removeColumn('reservations', 'code'),
    ]),
};
