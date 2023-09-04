import { Request, Response } from 'express'
import { Invoice } from '../models/Invoice'
import { Client } from '../../clients/models/Client'
import { User } from '../../users/models/User'

export default {
  async index(req: Request, res: Response) {
    const invoices = await Invoice.find({ user: req.body.userId }).populate('client')
     if (!invoices)
      return res.sendStatus(404)
    return res.json(invoices)
  },

  async show(req: Request, res: Response) {
    const invoice = await Invoice.findById(req.params.invoiceId).populate('client')
    return res.json(invoice)
  },

  async store(req: Request, res: Response) {
    const { userId, clientId, ref, date, notes, lineItems, subtotal, tax, total } = req.body
    console.log('#####', userId, clientId)
    const user = await User.findById(userId)
    const client = await Client.findById(clientId)
    await Invoice.create({
      ref,
      date,
      notes,
      lineItems,
      subtotal,
      tax,
      total,
      client,
      user
    })

    return res.sendStatus(201)
  }
}