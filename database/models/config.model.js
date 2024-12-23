const { Model, DataTypes } = require('sequelize');

const CONFIG_TABLE = 'configs';

const ConfigSchema = {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    invoceSerie: {
        allowNull: false,
        type: DataTypes.STRING,
        field: 'invoce_serie'
    },
    invoceNum: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'invoce_num'
    },
    boletaSerie: {
        allowNull: false,
        type: DataTypes.STRING,
        field: 'boleta_serie'
    },
    boletaNum: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'boleta_num'
    },
    ticketNum: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'ticket_num'
    },
}

class Config extends Model {

    static config(sequelize) {
        return {
            sequelize,
            tableName: CONFIG_TABLE,
            modelName: 'Config',
            timestamps: false
        }
    }
}

module.exports = { CONFIG_TABLE, ConfigSchema, Config }