import { Request, Response } from 'express'
import { Op, FindOptions } from 'sequelize'
import { _Invoice, _LineItem } from '@jimmyjames88/freebooks-types'
import Invoice, { _InvoiceInput } from '@models/Invoice'
import Client from '@models/Client'

const calculateTotals = (lineItems: _LineItem[]) => {
  // calculate subtotal, but remove any line items where rate or quantity are either missing or are not a number
  const subtotal = lineItems.reduce((acc: number, item: _LineItem) => {
    if (item.rate && item.quantity) {
      return acc + (Number(item.rate) * Number(item.quantity))
    }
    return acc
  }, 0)
  
  const tax = subtotal * 0.05
  const total = subtotal + tax
  return { subtotal, tax, total }
}

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
    if (req.query.filters) {
      const filters = req.query.filters as any
      if (filters.custom.pastDue) {
        options.where = {
          ...options.where,
          dueDate: { [Op.lt]: new Date() },
          status: ['draft', 'sent', 'partial']
        }
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
        as: 'client'
      }
    })
    return res.json(invoice)
  },

  async store(req: Request, res: Response) {
    const data: _InvoiceInput = req.body
    const totals = calculateTotals(data.lineItems)
    const invoice = await Invoice.create({
      ...data,
      ...totals
    })

    return res.status(201).json(invoice)
  },

  update(req: Request, res: Response) {
    const {
      id,
      refNo,
      issueDate,
      dueDate,
      notes,
      lineItems,
      clientId
    } = req.body

    const { subtotal, tax, total } = calculateTotals(lineItems)

    Invoice.update({
      refNo,
      issueDate,
      dueDate,
      notes,
      lineItems,
      subtotal,
      tax,
      total,
      clientId
    }, {
      where: {
        id: Number(id),
        userId: Number(req.body.userId)
      }
    }).then(() => {
      return res.sendStatus(204)
    }).catch((err: Error) => {
      console.warn(err)
      return res.sendStatus(500)
    })
  },

  async destroy(req: Request, res: Response) {
    Invoice.destroy({
      where: {
        id: Number(req.params.invoiceId),
        userId: Number(req.body.userId)
      }
    }).then((deleted) => {
      if (deleted)
        return res.sendStatus(204)
      return res.sendStatus(404)
    }).catch((err: Error) => {
      console.warn(err)
      return res.sendStatus(500)
    })
  },

  async loadLatestRefNo(req: Request, res: Response) {
    const invoice = await Invoice.findOne({
      where: {
        userId: Number(req.body.userId),
        refNo: { [Op.ne]: '' }
      },
      order: [ [ 'createdAt', 'DESC' ] ]
    })
    
    if (invoice?.refNo)
      return res.json({ refNo: invoice.refNo })
    return res.json({ refNo: 0 })
  }
}