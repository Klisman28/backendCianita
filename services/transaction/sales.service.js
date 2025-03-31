const boom = require('@hapi/boom');
const { Op } = require('sequelize');
const { models } = require('../../libs/sequelize');

class SalesService {
  async find(query) {
    const {
      limit,
      offset,
      sortColumn,
      sortDirection,
      filterField,
      filterType,
      filterValue
    } = query;

    const options = {
      where: {},
      include: [
        {
          model: models.Product,
          as: 'products',
          attributes: ['id', 'name', 'sku'],
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
    };

    const optionsCount = {
      where: {},
      include: [
        {
          model: models.Product,
          as: 'products',
          attributes: [],
          through: {
            as: 'item',
            attributes: []
          }
        }
      ]
    };

    if (limit && offset) {
      options.limit = parseInt(limit);
      options.offset = parseInt(offset);
    }

    // ----------------------------------------------------------
    // Lógica para filtrar por campos específicos de la tabla Sales
    // y para filtrar por nombre o SKU (código de barra) del producto.
    // ----------------------------------------------------------
    if (filterField && filterType && filterValue) {
      // Si el filtro está relacionado a los productos (búsqueda por nombre o sku),
      // en lugar de aplicarlo al "where" de Sales, lo aplicamos al "where" del include de Products.
      if (filterField === 'product') {
        // Por ejemplo, filterField= 'product', filterType='iLike', filterValue='loBuscado'
        if (filterType === 'iLike') {
          options.include[0].where = {
            [Op.or]: [
              { name: { [Op.iLike]: `%${filterValue}%` } },
              { sku: { [Op.iLike]: `%${filterValue}%` } },
            ]
          };
          optionsCount.include[0].where = {
            [Op.or]: [
              { name: { [Op.iLike]: `%${filterValue}%` } },
              { sku: { [Op.iLike]: `%${filterValue}%` } },
            ]
          };
        }
      } else {
        // Si el filtro es para otros campos de Sales, usamos el método addFilter
        const data = this.addFilter(filterField, filterType, filterValue);
        if (data !== null) {
          options.where = {
            ...options.where,
            [filterField]: data
          };
          optionsCount.where = {
            ...optionsCount.where,
            [filterField]: data
          };
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
        if (filterType !== "iLike" && !isNaN(filterValue)) {
          return {
            [Op[filterType]]: parseFloat(filterValue)
          };
        }
        return null;
      case 'igv':
        if (filterType !== "iLike" && !isNaN(filterValue)) {
          return {
            [Op[filterType]]: parseFloat(filterValue)
          };
        }
        return null;
      case 'saleableType':
        if (filterType === 'iLike') {
          const newFilterValue = filterValue.toLowerCase();
          if (newFilterValue === 'boleta') {
            return {
              [Op.eq]: "boletas"
            };
          } else if (newFilterValue === 'factura') {
            return {
              [Op.eq]: "invoces"
            };
          } else if (newFilterValue === 'ticket') {
            return {
              [Op.eq]: "tickets"
            };
          }
        }
        return null;
      case 'status':
        if (filterType === 'iLike') {
          if ((filterValue.toLowerCase()) === 'activo') {
            return {
              [Op.eq]: 1
            };
          } else if ((filterValue.toLowerCase()) === 'anulado') {
            return {
              [Op.eq]: 2
            };
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
        await sale.addProduct(product, {
          through: {
            quantity: item.quantity,
            unitPrice: item.unitPrice
          }
        });
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
    };

    const sales = await models.Sale.findAll(options);
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

  async returnSale(id) {
    const t = await models.sequelize.transaction();
    try {
      const sale = await this.findOne(id);

      if (sale.status === 2) {
        throw boom.conflict('La venta ya ha sido devuelta');
      }

      const updatedSale = await sale.update({ status: 2 }, { transaction: t });

      if (sale.products && sale.products.length > 0) {
        for (const product of sale.products) {
          const quantity = product.item.quantity;
          await models.Product.update(
            { stock: models.Sequelize.literal(`stock + ${quantity}`) },
            { where: { id: product.id }, transaction: t }
          );
        }
      }

      await t.commit();
      return updatedSale;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }
}

module.exports = SalesService;
