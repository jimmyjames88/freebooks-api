import { Request, Response } from 'express'
import { Op, FindOptions } from 'sequelize'
import { _Collection } from '@jimmyjames88/freebooks-types'
import { Client, Invoice, _ClientCreationAttributes } from '@models/index'

export default {
  async index(req: Request, res: Response) {
    const options: FindOptions  = {
      where: { 
        UserId: Number(req.body.UserId),
      },
      offset: (Number(req.query.page) - 1) * Number(req.query.itemsPerPage || 10) || 0,
      limit: Number(req.query.itemsPerPage) || 10
    } 
    if (req.query.search) {
      options.where = {
        ...options.where,
        [Op.or]: [
          { 'name': { [Op.like]: '%' + req.query.search + '%' } },
          { 'email': { [Op.like]: '%' + req.query.search + '%' } }
        ]
      }
    }
    if (req.query.sortBy) {
      const [ sortBy ] = req.query.sortBy as any
      options.order = [ [ sortBy.key, sortBy.order ] ]
    }

    const clients = await Client.findAll(options)
    const total = await Client.count({ where: options.where })
    if (!clients)
      return res.sendStatus(404)
    return res.json({
      items: clients,
      total
    })
  },

  async list(req: Request, res: Response): Promise<Response<_Collection<any>>> {
    const clients = await Client.findAll({ 
      attributes: [ 'id', 'name' ],
      where: { UserId: Number(req.body.UserId) }
    })
    return res.json({
      items: clients,
      total: clients.length
    })
  },

  async show(req: Request, res: Response) {
    const client = await Client.findByPk(req.params.ClientId, {
      include: [
        {
          model: Invoice,
          limit: 3,
          order: [ [ 'updatedAt', 'DESC' ] ]
        }
    ]
    })
    if (client)
      return res.json(client)
    return res.sendStatus(404);
  },

  async store(req: Request, res: Response) {
    const data: _ClientCreationAttributes = req.body
    const client = new Client({
      ...data,
      UserId: Number(req.body.UserId)
    })
    await client.save()

    return res.status(201).json({ id: client.id })
  },

  async edit(req: Request, res: Response) {
    const client = await Client.findByPk(req.params.ClientId)
    if (client)
      return res.json(client)
    return res.sendStatus(404)
  },

  async update(req: Request, res: Response) {
    const { name, address, phone, email, website } = req.body
    const client = await Client.findByPk(req.params.ClientId)
    if (client) {
      client.set({
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
    const client = await Client.findOne({
      where: { 
        UserId: Number(req.body.UserId),
        id: req.params.ClientId
      },
      include: Invoice
    })

    try {
      if (client) {
        if (client.Invoices) {
          client.Invoices.forEach(async (invoice) => {
            await invoice.destroy()
          })
          await client.destroy()
        }
        return res.sendStatus(204)
      }
    } catch(err: any) {
      return res.sendStatus(404).send(err.message)
    }
  }
}