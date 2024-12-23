const { Model, DataTypes } = require('sequelize');

const SUPPLIER_TABLE = 'suppliers';

const SupplierSchema = {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    name: {
        allowNull: false,
        type: DataTypes.STRING,
    },
    ruc: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true,
    },
    website: {
        type: DataTypes.STRING,
    },
    email: {
        allowNull: false,
        type: DataTypes.STRING,
    },
    telephone: {
        allowNull: false,
        type: DataTypes.STRING,
    },
    address: {
        type: DataTypes.STRING,
    }
}

class Supplier extends Model {
    // static associate(models) {
    //     this.hasMany(models.Subcategory, {
    //         as: 'subcategories',
    //         foreignKey: 'categoryId'
    //     });
    // }

    static config(sequelize) {
        return {
            sequelize,
            tableName: SUPPLIER_TABLE,
            modelName: 'Supplier',
            timestamps: false
        }
    }
}

module.exports = { SUPPLIER_TABLE, SupplierSchema, Supplier }