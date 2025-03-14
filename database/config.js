require('dotenv').config();

const USER = encodeURIComponent(process.env.DB_USERNAME);
const PASSWORD = encodeURIComponent(process.env.DB_PASSWORD); // Codificamos la contraseña
const HOST = process.env.DB_HOST;
const PORT = process.env.DB_PORT;
const DB_NAME = process.env.DB_NAME;

const URI = `mysql://${USER}:${PASSWORD}@${HOST}:${PORT}/${DB_NAME}`;

module.exports = {
    development: {
        url: URI,
        dialect: 'mysql',
        dialectOptions: {
            ssl: {
                require: false, // Requerir conexión SSL
                rejectUnauthorized: false // No rechazar conexiones no autenticadas con certificados
            }
        }
    },
    production: {
        url: URI,
        dialect: 'mysql',
        dialectOptions: {
            ssl: {
                require: false,
                rejectUnauthorized: false
            }
        }
    }
};

