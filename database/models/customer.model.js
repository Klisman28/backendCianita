const { Model, DataTypes } = require('sequelize');

const CUSTOMER_TABLE = 'customers';

const CustomerSchema = {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    name: {
        allowNull: false,
        type: DataTypes.STRING,
        get() {
            const newValue = this.getDataValue('name');
            return newValue[0].toUpperCase() + newValue.slice(1);
        },
        set(value) {
            this.setDataValue('name', value.toLowerCase().trim());
        }
    },
    firstLastname: {
        allowNull: false,
        type: DataTypes.STRING,
        field: 'first_lastname',
        get() {
            const newValue = this.getDataValue('firstLastname');
            return newValue[0].toUpperCase() + newValue.slice(1);
        },
        set(value) {
            this.setDataValue('firstLastname', value.toLowerCase().trim());
        }
    },
    secondLastname: {
        allowNull: false,
        type: DataTypes.STRING,
        field: 'second_lastname',
        get() {
            const newValue = this.getDataValue('secondLastname');
            return newValue[0].toUpperCase() + newValue.slice(1);
        },
        set(value) {
            this.setDataValue('secondLastname', value.toLowerCase().trim());
        }
    },
    fullname: {
        allowNull: false,
        type: DataTypes.STRING,
    },
    dni: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true,
    },
    email: {
        type: DataTypes.STRING,
    },
    telephone: {
        type: DataTypes.STRING,
    },
    address: {
        type: DataTypes.STRING,
    }
}

class Customer extends Model {
    // static associate(models) {
    //     this.hasMany(models.Subcategory, {
    //         as: 'subcategories',
    //         foreignKey: 'categoryId'
    //     });
    // }

    static config(sequelize) {
        return {
            sequelize,
            tableName: CUSTOMER_TABLE,
            modelName: 'Customer',
            timestamps: false
        }
    }
}

module.exports = { CUSTOMER_TABLE, CustomerSchema, Customer }