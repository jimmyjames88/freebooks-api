import { Request, Response } from 'express'
import { Invoice } from '@models/Invoice'
import { Client } from '@models/Client'
import { User } from '@models/User'

export default {
  async index(req: Request, res: Response) {
    const invoices = await Invoice.findAll({ 
      where: { user: req.body.userId }
    })
    if (invoices)
      return res.json(invoices)
    return res.sendStatus(404)
    
  },

  async show(req: Request, res: Response) {
    const invoice = await Invoice.findByPk(req.params.invoiceId)
    return res.json(invoice)
  },

  async store(req: Request, res: Response) {
    const { userId, clientId, ref, date, notes, lineItems, subtotal, tax, total } = req.body
    console.log('#####', userId, clientId)
    const user = await User.findByPk(userId)
    const client = await Client.findByPk(clientId)
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