'use strict';

module.exports = {
  async up(queryInterface) {
    queryInterface.sequelize.query(`CREATE OR REPLACE FUNCTION products_increment_stock() RETURNS TRIGGER
    AS
    $$
    BEGIN
        UPDATE products SET stock=stock+new.quantity WHERE id=new.product_id;
        RETURN NEW;
    END
    $$ 
    LANGUAGE plpgsql;
    CREATE TRIGGER BI_products_purchases_increment_stock AFTER INSERT 
    ON products_purchases FOR EACH ROW
    EXECUTE PROCEDURE products_increment_stock();`);
  },

  async down(queryInterface, Sequelize) {
    
  }
};
