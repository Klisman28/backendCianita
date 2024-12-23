const Joi = require('joi');

const id = Joi.number().integer();
const name = Joi.string().min(3).max(100);
const firstLastname = Joi.string().min(3).max(100);
const secondLastname = Joi.string().min(3).max(100);
const dni = Joi.string().min(8).max(8);
const birthdate = Joi.date();
const gender = Joi.string();
const email = Joi.string().email();
const telephone = Joi.string().min(9).max(15);
const address = Joi.string();

const offset = Joi.number().integer();
const limit = Joi.number().integer();
const search = Joi.string();
const sortColumn = Joi.string();
const sortDirection = Joi.string();

const createEmployeeSchema = Joi.object({
    name: name.required(),
    firstLastname: firstLastname.required(),
    secondLastname: secondLastname.required(),
    dni: dni.required(),
    birthdate,
    gender: gender.required(),
    email,
    telephone,
    address
});

const getEmployeeSchema = Joi.object({
    id: id.required(),
});

const queryEmployeeSchema = Joi.object({
    offset,
    limit,
    search,
    sortColumn,
    sortDirection
});

module.exports = { createEmployeeSchema, getEmployeeSchema, queryEmployeeSchema }