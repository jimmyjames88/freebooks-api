import { Request, Response } from 'express'
import Client from '@models/Client'
import Invoice from '@models/Invoice'
import Payment from '@models/Payment'
import { _InvoiceStatus, _Payment } from '@jimmyjames88/freebooks-types'

export default {
  async index(req: Request, res: Response) {
    try {
      const payments = await Payment.findAll({
        where: {
          userId: Number(req.body.userId)
        },
        include: [
          {
            model: Invoice,
            attributes: ['id', 'refNo'],
            include: [
              {
                model: Client,
                attributes: ['id', 'name']
              }
            ]
          },
          {
            model: Client,
            attributes: ['id', 'name']
          }
        ]
      })
      const total = await Invoice.count({ 
        include: Client,
        where: { userId: Number(req.body.userId) }
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
          id: Number(req.body.invoiceId),
          userId: Number(req.body.userId)
        },
        include: [{ model: Payment, as: 'payments' }]
      })

      if (invoice) {
        const payment = await invoice.createPayment(req.body)
        invoice.payments.push(payment)
        const paymentTotal = invoice.payments.reduce((acc, payment: _Payment) => {
          return acc + payment.amount
        }, 0)
        console.log('>>>>', paymentTotal, invoice.total)
        if (paymentTotal >= invoice.total) {
          console.log('###########')
          invoice.status = _InvoiceStatus.PAID
          await invoice.save()
        }
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
          userId: Number(req.body.userId)
        }
      })
      if (payment) {
        payment.set({
          ...req.body,
          userId: Number(req.body.userId)
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
    try {
      const payment = await Payment.findOne({
        where: {
          id: Number(req.body.id),
          userId: Number(req.body.userId)
        }
      })
      if (payment) {
        await payment.destroy()
        res.send(payment)
      }
    } catch (err: any) {
      res.status(500).send({
        error: err.message
      })
    }
  },
  
}