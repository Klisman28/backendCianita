'use strict';

const { ROLE_USER_TABLE, RoleUserSchema } = require('../models/role-user.model');

module.exports = {
  async up (queryInterface) {
    await queryInterface.createTable(ROLE_USER_TABLE, RoleUserSchema);
  },

  async down (queryInterface) {
    await queryInterface.dropTable(ROLE_USER_TABLE);
  }
};
