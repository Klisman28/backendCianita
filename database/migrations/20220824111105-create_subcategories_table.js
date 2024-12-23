'use strict';

const { SUBCATEGORY_TABLE, SubcategorySchema } = require('../models/subcategory.model');

module.exports = {
  async up (queryInterface) {
    await queryInterface.createTable(SUBCATEGORY_TABLE, SubcategorySchema);
  },

  async down (queryInterface) {
    await queryInterface.dropTable(SUBCATEGORY_TABLE);
  }
};
