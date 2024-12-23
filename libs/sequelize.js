const Sequelize = require('sequelize');
const database = require('../config/database');
const setupModels = require('../database/models');

const USER = encodeURIComponent(database.dbUser);
const PASSWORD = encodeURIComponent(database.dbPassword);
const URI = `postgres://${USER}:${PASSWORD}@${database.dbHost}:${database.dbPort}/${database.dbName}`

const sequelize = new Sequelize(URI, {
    dialect: 'postgres',
    logging: (msg) => console.log('run db!!' + msg),
});

setupModels(sequelize);

module.exports = sequelize;