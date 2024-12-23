const { Model, DataTypes } = require('sequelize');
const { CASHIER_TABLE } = require('./cashier.model');
const { EMPPLOYEE_TABLE } = require('./employee.model');

const OPENING_TABLE = 'openings';

const OpeningSchema = {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    initBalance: {
        allowNull: false,
        type: DataTypes.DECIMAL(8,2),
        field: 'init_balance'
    },
    saleBalance: {
        type: DataTypes.DECIMAL(8,2),
        field: 'sale_balance'
    },
    startDatetime: {
        field: 'start_datetime',
        allowNull: false,
        type: DataTypes.DATE,
    },
    endDatetime: {
        field: 'end_datetime',
        type: DataTypes.DATE,
    },
    status: {
        allowNull: false,
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    cashierId: {
        field: 'cashier_id',
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
            model: CASHIER_TABLE,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
    },
    employeeId: {
        field: 'employee_id',
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
            model: EMPPLOYEE_TABLE,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
    },
}

class Opening extends Model {
    static associate(models) {
        this.belongsTo(models.Cashier, {
            as: 'cashier'
        });

        this.belongsTo(models.Employee, {
            as: 'employee'
        });
        
        this.hasMany(models.Sale, {
            as: 'sales',
            foreignKey: 'openingId'
        });
    }

    static config(sequelize) {
        return {
            sequelize,
            tableName: OPENING_TABLE,
            modelName: 'Opening',
            timestamps: false
        }
    }
}


module.exports = { OPENING_TABLE, OpeningSchema, Opening }