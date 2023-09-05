import { Request, Response } from 'express'
import { Client } from '../models/Client'
import { User } from '../../users/models/User'
import { Invoice } from '../../invoices/models/Invoice'

export default {
  async index(req: Request, res: Response) {
    const clients = await Client.find({ user: req.body.userId })
     if (!clients)
      return res.sendStatus(404)
    return res.json(clients)
  },

  async list(req: Request, res: Response) {
    const clients = await Client.find({ user: req.body.userId}).select('name')
    return res.json(clients)
  },

  async show(req: Request, res: Response) {
    const client: any = await Client.findById(req.params.clientId);
    const invoices = await Invoice.find({ client });
    if (client) {
      client.invoices = invoices
      return res.json(client)
    }
    return res.sendStatus(404);
  },

  async store(req: Request, res: Response) {
    const { userId, name, address, phone, email, website } = req.body
    const user = await User.findById(userId)
    const client = new Client({
      name,
      address,
      email,
      phone,
      website,
      user
    })
    client.save()

    return res.status(201).json({ _id: client._id })
  },

  async destroy(req: Request, res: Response) {
    const client = await Client.findByIdAndDelete(req.params.clientId)
    Invoice.deleteMany({ client: req.params.clientId })

    if (client)
      return res.sendStatus(204)
    return res.sendStatus(404)
  }
}