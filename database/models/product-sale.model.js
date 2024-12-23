const { Model, DataTypes } = require('sequelize');
const { PRODUCT_TABLE } = require('./product.model');
const { SALE_TABLE } = require('./sale.model');

const   PRODUCT_SALE_TABLE = 'products_sales';

const ProductSaleSchema = {
    productId: {
        field: 'product_id',
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
            model: PRODUCT_TABLE,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    saleId: {
        field: 'sale_id',
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
            model: SALE_TABLE,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    quantity: {
        allowNull: false,
        type: DataTypes.INTEGER(),
    },
    unitPrice: {
        allowNull: false,
        type: DataTypes.DECIMAL(8,2),
        field: "unit_price"
    }
}

class ProductSale extends Model {
    static config(sequelize) {
        return {
            sequelize,
            tableName: PRODUCT_SALE_TABLE,
            modelName: 'ProductSale',
            timestamps: false
        }
    }
}

module.exports = { PRODUCT_SALE_TABLE, ProductSaleSchema, ProductSale };