const boom = require('@hapi/boom');
const { Op } = require('sequelize');
const { models } = require('../../libs/sequelize');

class SalesService {
    async find(query) {
        const { limit, offset, sortColumn, sortDirection, filterField, filterType, filterValue } = query;

        const options = {
            where: {},
            include: [
                {
                    model: models.Product,
                    as: 'products',
                    attributes: ['id', 'name'],
                    include: [
                        {
                            model: models.Brand,
                            as: 'brand',
                            attributes: ['name']
                        },
                        {
                            model: models.Unit,
                            as: 'unit',
                            attributes: ['symbol']
                        }
                    ],
                    through: {
                        as: 'item',
                        attributes: ['quantity', 'unitPrice']
                    }
                },
                {
                    model: models.Opening,
                    as: 'opening',
                    attributes: [],
                    include: [
                        {
                            model: models.Employee,
                            as: 'employee',
                            attributes: ['fullname', 'dni'],
                        }
                    ]
                },
                {
                    model: models.Customer,
                    as: 'customer',
                    attributes: ['fullname', 'dni', 'email', 'telephone']
                },
                {
                    model: models.Enterprise,
                    as: 'enterprise',
                    attributes: ['name', 'ruc', 'email', 'telephone']
                },
            ],
            order: [(sortColumn) ? [sortColumn, sortDirection] : ['id', 'DESC']]
        }
        const optionsCount = { where: {} };

        if (limit && offset) {
            options.limit = limit;
            options.offset = offset;
        }

        if (filterField && filterType && filterValue) {
            const data = this.addFilter(filterField, filterType, filterValue);
            console.log(data);
            if (data != null) {
                options.where = {
                    ...options.where,
                    [filterField]: data
                }
                optionsCount.where = {
                    ...optionsCount.where,
                    [filterField]: data
                }
            }
        }

        const sales = await models.Sale.findAll(options);
        const total = await models.Sale.count(optionsCount);

        return { sales, total };
    }

    addFilter(filterField, filterType, filterValue) {
        switch (filterField) {
            case 'total':
                if (filterType != "iLike" && !isNaN(filterValue)) {
                    return {
                        [Op[filterType]]: parseFloat(filterValue)
                    }
                }
                return null;
            case 'igv':
                if (filterType != "iLike" && !isNaN(filterValue)) {
                    return {
                        [Op[filterType]]: parseFloat(filterValue)
                    }
                }
                return null;
            case 'saleableType':
                if (filterType == 'iLike') {
                    const newFilterValue = filterValue.toLowerCase();
                    if (newFilterValue === 'boleta') {
                        return {
                            [Op.eq]: "boletas"
                        }
                    } else if (newFilterValue === 'factura') {
                        return {
                            [Op.eq]: "invoces"
                        }
                    } else if (newFilterValue === 'ticket') {
                        return {
                            [Op.eq]: "tickets"
                        }
                    }
                }
                return null;
            case 'status':
                if (filterType == 'iLike') {
                    if ((filterValue.toLowerCase()) === 'activo') {
                        return {
                            [Op.eq]: 1
                        }
                    } else if ((filterValue.toLowerCase()) === 'anulado') {
                        return {
                            [Op.eq]: 2
                        }
                    }
                }
                return null;
            default:
                return null;
        }
    }

    async create(data) {
        const sale = await models.Sale.create(data);
        if (data.products && data.products.length > 0) {
            data.products.forEach(async (item) => {
                const product = await models.Product.findByPk(item.productId);
                await sale.addProduct(product, { through: { quantity: item.quantity, unitPrice: item.unitPrice } });
            });
        }
        return sale;
    }

    async findByOpening(openingId) {
        const options = {
            where: {
                openingId: openingId
            },
            include: [
                {
                    model: models.Product,
                    as: 'products',
                    attributes: ['id', 'name'],
                    include: [
                        {
                            model: models.Brand,
                            as: 'brand',
                            attributes: ['name']
                        },
                        {
                            model: models.Unit,
                            as: 'unit',
                            attributes: ['symbol']
                        }
                    ],
                    through: {
                        as: 'item',
                        attributes: ['quantity', 'unitPrice']
                    }
                },
                {
                    model: models.Opening,
                    as: 'opening',
                    attributes: [],
                    include: [
                        {
                            model: models.Employee,
                            as: 'employee',
                            attributes: ['fullname', 'dni'],
                        }
                    ]
                },
                {
                    model: models.Customer,
                    as: 'customer',
                    attributes: ['fullname', 'dni', 'email', 'telephone']
                },
                {
                    model: models.Enterprise,
                    as: 'enterprise',
                    attributes: ['name', 'ruc', 'email', 'telephone']
                },
            ]
        }

        const sales = await models.Sale.findAll(options)
        const total = await models.Sale.count(options);

        return { sales, total };
    }

    async findOne(id) {
        const sale = await models.Sale.findByPk(id, {
            include: [
                {
                    model: models.Opening,
                    as: 'opening',
                    attributes: [],
                    include: [
                        {
                            model: models.Employee,
                            as: 'employee',
                            attributes: ['fullname', 'dni'],
                        }
                    ]
                },
                {
                    model: models.Product,
                    as: 'products',
                    attributes: ['id', 'name'],
                    include: {
                        model: models.Brand,
                        as: 'brand',
                        attributes: ['name']
                    },
                    through: {
                        as: 'item',
                        attributes: ['quantity', 'unitPrice']
                    }
                },
                {
                    model: models.Customer,
                    as: 'customer',
                    attributes: ['fullname', 'dni', 'email', 'telephone']
                },
                {
                    model: models.Enterprise,
                    as: 'enterprise',
                    attributes: ['name', 'ruc', 'email', 'telephone']
                },
            ],
        });
        if (!sale) {
            throw boom.notFound('No se encontró ninguna venta');
        }
        return sale;
    }

    async update(id, changes) {
        let sale = await this.findOne(id);
        sale = await sale.update(changes);
        // if (changes.products && changes.products.length > 0) {
        //     await models.ProductPurchas.destroy({
        //         where: {
        //             productId: id
        //         }
        //     });
        //     changes.products.forEach(async (item) => {
        //         const product = await models.Product.findByPk(id)
        //         await sale.addProduct(product, { through: { quantity: item.quantity, unitCost: item.unitCost } });
        //     });
        // }
        return sale;
    }

    async delete(id) {
        const sale = await this.findOne(id);
        await sale.destroy();
        return { id };
    }
}

module.exports = SalesService;