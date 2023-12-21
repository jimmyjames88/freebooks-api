import { Request, Response } from 'express'
import { Op, FindOptions } from 'sequelize'
import Invoice from '@models/Invoice'
import Client from '@models/Client'
import User from '@models/User'

export default {
  async index(req: Request, res: Response) {
    const options: FindOptions  = {
      where: { 
        userId: Number(req.body.userId),
      },
      offset: (Number(req.query.page) - 1) * Number(req.query.itemsPerPage || 10) || 0,
      limit: Number(req.query.itemsPerPage) || 10,
      include: [{
        model: Client,
        attributes: [ 'id', 'name' ],
        as: 'client'
      }]
    } 
    if (req.query.search) {
      options.where = {
        ...options.where,
        [Op.or]: [
          { 'refNo': { [Op.like]: '%' + req.query.search + '%' } },
          { '$client.name$': { [Op.like]: '%' + req.query.search + '%' } }
        ]
      }
    }
    if (req.query.sortBy) {
      let [ sortBy ] = req.query.sortBy as any
      if (sortBy.key === 'client.name') {
        options.order = [ [{ model: Client, as: 'client' }, 'name', sortBy.order] ]
      } else {
        options.order = [[ sortBy.key, sortBy.order ]]
      }
    }

    const invoices = await Invoice.findAll(options)
    const total = await Invoice.count({ include: Client, where: options.where })
    if (!invoices)
      return res.sendStatus(404)
    return res.json({
      items: invoices,
      total
    })
  },

  async show(req: Request, res: Response) {
    const invoice = await Invoice.findOne({
      where: {
        id: Number(req.params.invoiceId),
        userId: Number(req.body.userId)
      },
      include: {
        model: Client,
        attributes: [ 'id', 'name' ],
        as: 'client'
      }
    })
    return res.json(invoice)
  },

  async store(req: Request, res: Response) {
    const { userId, clientId, refNo, date, notes, lineItems, subtotal, tax, total } = req.body
    const invoice = await Invoice.create({
      refNo,
      date,
      notes,
      lineItems,
      subtotal,
      tax,
      total,
      clientId,
      userId
    })

    return res.status(201).json(invoice)
  }
}