'use strict';

module.exports = {
  up: queryInterface => queryInterface.renameColumn('pet_walk_instructions', 'order', 'position'),
  down: Promise.resolve(), // no rollback it's possible,
};
