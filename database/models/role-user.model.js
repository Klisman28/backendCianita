const { Model, DataTypes } = require('sequelize');

const { ROLE_TABLE } = require('./role.model');
const { USER_TABLE } = require('./user.model');

const ROLE_USER_TABLE = 'roles_users';

const RoleUserSchema =  {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  roleId: {
    field: 'role_id',
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: ROLE_TABLE,
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  },
  userId: {
    field: 'user_id',
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: USER_TABLE,
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  }
}

class RoleUser extends Model {
  static config(sequelize) {
    return {
      sequelize,
      tableName: ROLE_USER_TABLE,
      modelName: 'RoleUser',
      timestamps: false
    }
  }
}

module.exports = { RoleUser, RoleUserSchema, ROLE_USER_TABLE };