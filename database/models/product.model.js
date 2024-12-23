const { Model, DataTypes } = require('sequelize');
const SequelizeSlugify = require('sequelize-slugify');
const { BRAND_TABLE } = require('./brand.model');
const { SUBCATEGORY_TABLE } = require('./subcategory.model');
const { UNIT_TABLE } = require('./unit.model');

const PRODUCT_TABLE = 'products';

const ProductSchema = {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    sku: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true
    },
    name: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true
    },
    slug: {
        type: DataTypes.STRING,
        unique: true
    },
    cost: {
        type: DataTypes.DECIMAL(8,2),
        allowNull: false
    },
    utility: {
        type: DataTypes.DECIMAL(8,2),
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(8,2),
        allowNull: false
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    stockMin: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'stock_min'
    },
    imageUrl: {
        allowNull: true,
        type: DataTypes.STRING,
        field: 'image_url'
    },
    brandId: {
        field: 'brand_id',
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
            model: BRAND_TABLE,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
    },
    subcategoryId: {
        field: 'subcategory_id',
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
            model: SUBCATEGORY_TABLE,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
    },
    unitId: {
        field: 'unit_id',
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
            model: UNIT_TABLE,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
    },
    //descomentar despues de correr las migraciones
    // status: {
    //     type: DataTypes.VIRTUAL,
    //     get() {
    //         const stock = this.stock;
    //         const stockMin = this.stockMin;
    //         let status = 0;

    //         if(stock == 0){
    //             status = 2;
    //         } else if (stock <= stockMin) {
    //             status = 1;
    //         }

    //         return status;
    //       },
    // }
}

class Product extends Model {
    static associate(models) {
        this.belongsTo(models.Brand, {
            as: 'brand'
        });
        this.belongsTo(models.Subcategory, {
            as: 'subcategory'
        });
        this.belongsTo(models.Unit, {
            as: 'unit'
        });
        // this.hasMany(models.Feature, {
        //     as: 'features',
        //     foreignKey: 'productId'
        // });
    }

    static config(sequelize) {
        return {
            sequelize,
            tableName: PRODUCT_TABLE,
            modelName: 'Product',
            timestamps: false
        }
    }

    static slugify(models) {
        SequelizeSlugify.slugifyModel(models.Product, {
            source: ['name']
        });
    }
}

module.exports = { PRODUCT_TABLE, ProductSchema, Product }