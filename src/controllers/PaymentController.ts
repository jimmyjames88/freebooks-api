import { Request, Response } from 'express'
import { _Collection, _InvoiceStatus } from '@jimmyjames88/freebooks-types'
import { Client, Invoice, Payment, PaymentType } from '@models/index'

export default {
  async index(req: Request, res: Response) {
    try {
      const payments = await Payment.findAll({
        where: {
          UserId: Number(req.body.UserId)
        },
        include: [
          { model: Invoice, attributes: ['id', 'refNo'] },
          { model: Client, attributes: ['id', 'name'] },
          { model: PaymentType }
        ]
      })
      const total = await Payment.count({ 
        where: { UserId: Number(req.body.UserId) }
      })
      res.json({ items: payments, total }) 
    } catch (err: any) {
      res.status(500).send({
        error: err.message
      })
    }
  },

  async store(req: Request, res: Response) {
    try {
      const invoice = await Invoice.findOne({
        where: {
          id: Number(req.body.InvoiceId),
          UserId: Number(req.body.UserId)
        },
        include: [{ model: Payment }]
      })

      if (invoice) {
        const payment = await invoice.createPayment(req.body)
        invoice.Payments.push(payment)
        const paymentTotal = invoice.Payments.reduce((acc, payment: Payment) => {
          return acc + payment.amount
        }, 0)
        invoice.total = await invoice.calculateTotal()
        await invoice.save()
        return res.status(201).json(payment)
      }
    } catch (err: any) {
      res.status(500).send({
        error: err.message
      })
    }
  },

  async update(req: Request, res: Response) {
    try {
      const payment = await Payment.findOne({
        where: {
          id: Number(req.body.id),
          UserId: Number(req.body.UserId)
        }
      })
      if (payment) {
        payment.set({
          ...req.body,
          UserId: Number(req.body.UserId)
        })
        await payment.save()
        res.send(payment)
      }
    } catch (err: any) {
      res.status(500).send({
        error: err.message
      })
    }
  },

  async destroy(req: Request, res: Response) {
    console.log(req.params, req.query, req.body)
    try {
      const payment = await Payment.findOne({
        where: {
          id: Number(req.params.PaymentId),
          UserId: Number(req.body.UserId)
        }
      })
      if (payment) {
        const invoice = await Invoice.findOne({
          where: {
            id: payment.InvoiceId,
            UserId: Number(req.body.UserId)
          }
        })

        await payment.destroy()
        if (invoice) {
          invoice.total = await invoice.calculateTotal()
          await invoice.save()
        }
        res.send(payment)
      }
    } catch (err: any) {
      res.status(500).send({
        error: err.message
      })
    }
  },
  
  async types(req: Request, res: Response) {
    try {
      const types = await PaymentType.findAll()
      res.json({
        items: types,
        total: types.length 
      })
    } catch (err: any) {
      console.warn(err.message)

      res.status(500).send({
        error: err.message
      })
    }
  }
}