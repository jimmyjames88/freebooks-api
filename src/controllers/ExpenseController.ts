import { Request, Response } from 'express'
import { FindOptions } from 'sequelize'
import { Expense, Invoice } from '@models/index'
import { _InvoiceStatus, _Payment } from '@jimmyjames88/freebooks-types'

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

  async store(req: Request, res: Response) {
    try {
      const expense = await Expense.create(req.body)
      res.status(201).json(expense)
    } catch (err: any) {
      console.warn(err)
      res.status(500).send({
        error: err.message
      })
    }
  }

  // async store(req: Request, res: Response) {
  //   try {
  //     const invoice = await Invoice.findOne({
  //       where: {
  //         id: Number(req.body.InvoiceId),
  //         UserId: Number(req.body.UserId)
  //       },
  //       include: [{ model: Payment }]
  //     })

  //     if (invoice) {
  //       const payment = await invoice.createPayment(req.body)
  //       invoice.Payments.push(payment)
  //       const paymentTotal = invoice.Payments.reduce((acc, payment: _Payment) => {
  //         return acc + payment.amount
  //       }, 0)
  //       console.log('>>>>', paymentTotal, invoice.total)
  //       if (paymentTotal >= invoice.total) {
  //         console.log('###########')
  //         invoice.status = _InvoiceStatus.PAID
  //         await invoice.save()
  //       }
  //       return res.status(201).json(payment)
  //     }
  //   } catch (err: any) {
  //     res.status(500).send({
  //       error: err.message
  //     })
  //   }
  // },

  // async update(req: Request, res: Response) {
  //   try {
  //     const payment = await Payment.findOne({
  //       where: {
  //         id: Number(req.body.id),
  //         UserId: Number(req.body.UserId)
  //       }
  //     })
  //     if (payment) {
  //       payment.set({
  //         ...req.body,
  //         UserId: Number(req.body.UserId)
  //       })
  //       await payment.save()
  //       res.send(payment)
  //     }
  //   } catch (err: any) {
  //     res.status(500).send({
  //       error: err.message
  //     })
  //   }
  // },

  // async destroy(req: Request, res: Response) {
  //   try {
  //     const payment = await Payment.findOne({
  //       where: {
  //         id: Number(req.body.id),
  //         UserId: Number(req.body.UserId)
  //       }
  //     })
  //     if (payment) {
  //       await payment.destroy()
  //       res.send(payment)
  //     }
  //   } catch (err: any) {
  //     res.status(500).send({
  //       error: err.message
  //     })
  //   }
  // },
  
}