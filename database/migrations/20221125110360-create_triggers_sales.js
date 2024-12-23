'use strict';

module.exports = {
  async up(queryInterface) {
    queryInterface.sequelize.query(`CREATE OR REPLACE FUNCTION products_decrement_stock() RETURNS TRIGGER
    AS
    $$
    BEGIN
        UPDATE products SET stock=stock-new.quantity WHERE id=new.product_id;
        RETURN NEW;
    END
    $$ 
    LANGUAGE plpgsql;
    CREATE TRIGGER BI_products_sales_decrement_stock AFTER INSERT 
    ON products_sales FOR EACH ROW
    EXECUTE PROCEDURE products_decrement_stock();`);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
