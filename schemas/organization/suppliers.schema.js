const Joi = require('joi');

const id = Joi.number().integer();
const name = Joi.string().min(3).max(100);
const ruc = Joi.string().min(10).max(15);
const website = Joi.string().uri();
const email = Joi.string().email();
const telephone = Joi.string().min(9).max(15);
const address = Joi.string();

const offset = Joi.number().integer();
const limit = Joi.number().integer();
const search = Joi.string();
const sortColumn = Joi.string();
const sortDirection = Joi.string();

const createSupplierSchema = Joi.object({
    name: name.required(),
    ruc: ruc.required(),
    website,
    email: email.required(),
    telephone: telephone.required(),
    address
});

const getSupplierSchema = Joi.object({
    id: id.required(),
});

const querySupplierSchema = Joi.object({
    offset,
    limit,
    search,
    sortColumn,
    sortDirection
});

module.exports = { createSupplierSchema, getSupplierSchema, querySupplierSchema }