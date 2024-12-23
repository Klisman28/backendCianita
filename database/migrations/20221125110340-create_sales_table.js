'use strict';

const { SALE_TABLE, SaleSchema } = require('../models/sale.model');

module.exports = {
  async up(queryInterface) {
    await queryInterface.createTable(SALE_TABLE, SaleSchema);
  },

  async down(queryInterface) {
    await queryInterface.dropTable(SALE_TABLE);
  }
};
