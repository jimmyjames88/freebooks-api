import { Request, Response } from 'express'
import { FindOptions } from 'sequelize'
import { Client, Expense, Invoice, PaymentType, Tax } from '@models/index'
import { _ExpenseInputCreate, _InvoiceStatus, _Payment, _Tax } from '@jimmyjames88/freebooks-types'

export default {
  async index(req: Request, res: Response) {
    const options: FindOptions = {
      where: {
        UserId: Number(req.body.UserId)
      },
      offset: (Number(req.query.page) - 1) * Number(req.query.itemsPerPage || 10) || 0,
      limit: Number(req.query.itemsPerPage) || 10,
      include: [{ 
        model: Invoice,
        attributes: ['id', 'refNo']
      }]
    }

    if(req.query.unattached) {
      options.where = {
        ...options.where,
        InvoiceId: null
      }
    }

    if (req.query.sortBy) {
      let [sortBy] = req.query.sortBy as any
      if (sortBy.key === 'invoice.refNo') {
        options.order = [[ { model: Invoice, as: 'Invoice' }, 'refNo', sortBy.order]]
      } else {
        options.order = [[sortBy.key, sortBy.order]]
      }
    }

    try {
      const expenses = await Expense.findAll(options)
      const total = await Expense.count({ where: options.where })
      res.json({ items: expenses, total }) 
    } catch (err: any) {
      console.warn(err)
      res.status(500).send({
        error: err.message
      })
    }
  },

  async show(req: Request, res: Response) {
    try {
      const expense = await Expense.findOne({
        where: {
          id: Number(req.params.id),
          UserId: Number(req.body.UserId)
        },
        include: [
          { model: Invoice, include: [{ model: Client }] },
          { model: PaymentType },
          { model: Tax }
        ]
      })
      res.json(expense)
    } catch (err: any) {
      console.warn(err)
      res.status(500).send({
        error: err.message
      })
    }
  },

  async store(req: Request, res: Response) {
    try {
      const expense = await Expense.create(req.body)
      expense.setTaxes(req.body.Taxes?.map((tax: _Tax) => tax.id))
      expense.setInvoice(req.body.Invoice?.id)
      await expense.save()
      await expense.Invoice?.save()
      res.status(201).json(expense)
    } catch (err: any) {
      console.warn(err)
      res.status(500).send({
        error: err.message
      })
    }
  },

  async update(req: Request, res: Response) {
    try {
      const expense = await Expense.findByPk(req.params.id, { include: [{ model: Invoice, include: [Client] }, { model: PaymentType }] })
      if (!expense) {
        return res.sendStatus(404)
      }
      expense.setTaxes(req.body.Taxes?.map((tax: _Tax) => tax.id))
      expense.setInvoice(req.body.Invoice?.id)
      await expense.save()
      await expense.Invoice?.save()
      await expense.update(req.body)
      res.json(expense)
    } catch (err: any) {
      console.warn(err)
      res.status(500).send({
        error: err.message
      })
    }
  },

  async destroy(req: Request, res: Response) {
    try {
      const expense = await Expense.findByPk(req.params.id)
      if (!expense) {
        return res.sendStatus(404)
      }
      await expense.destroy()
      res.sendStatus(204)
    } catch (err: any) {
      console.warn(err)
      res.status(500).send({
        error: err.message
      })
    }
  }
}