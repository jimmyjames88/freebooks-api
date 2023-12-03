import { Request, Response } from 'express'
import { Client } from '@models/Client'
import { User } from '@models/User'
import { Invoice } from '@models/Invoice'

export default {
  async index(req: Request, res: Response) {
    const clients = await Client.findAll({ 
      where: { userId: Number(req.body.userId) }
    })
    if (!clients)
      return res.sendStatus(404)
    return res.json(clients)
  },

  async list(req: Request, res: Response) {
    const clients = await Client.findAll({ 
      attributes: [ 'id', 'name' ],
      where: { userId: Number(req.body.userId) }
    })
    return res.json(clients)
  },

  async show(req: Request, res: Response) {
    const client = await Client.findByPk(req.params.clientId)
    if (client)
      return res.json(client)
    return res.sendStatus(404);
  },

  async store(req: Request, res: Response) {
    const { userId, name, address, phone, email, website } = req.body
    const user = await User.findByPk(userId)
    const client = new Client({
      name,
      address,
      email,
      phone,
      website,
      user
    })
    client.save()

    return res.status(201).json({ id: client.id })
  },

  async edit(req: Request, res: Response) {
    const client = await Client.findByPk(req.params.clientId)
    if (client)
      return res.json(client)
    return res.sendStatus(404)
  },

  async update(req: Request, res: Response) {
    const { name, address, phone, email, website } = req.body
    const client = await Client.findByPk(req.params.clientId)
    if (client) {
      client.set( {
        name,
        address,
        email,
        phone,
        website
      })
      await client.save()
      return res.sendStatus(204)
    }
    return res.sendStatus(404)
  },

  async destroy(req: Request, res: Response) {
    const client = await Client.findByPk(req.params.clientId)
    if (client)
      await client.destroy()

    const destroyed = await Invoice.destroy({ where: { client: req.params.clientId }})
    return res.sendStatus(destroyed ? 204 : 404)
  }
}