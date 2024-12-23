'use strict';

const { ROLE_TABLE, RoleSchema} = require('../models/role.model');

module.exports = {
  async up (queryInterface) {
    await queryInterface.createTable(ROLE_TABLE, RoleSchema);
  },

  async down (queryInterface) {
    await queryInterface.dropTable(ROLE_TABLE);
  }
};
