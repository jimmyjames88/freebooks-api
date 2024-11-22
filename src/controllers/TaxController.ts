import { Request, Response } from 'express'
import { Tax } from '@models/index'

export default {
  async index(req: Request, res: Response) {
    const taxes = await Tax.findAll({
      where: { UserId: Number(req.body.UserId) }
    })
    if (taxes) {
      return res.json({
        items: taxes,
        total: taxes.length
      })
    }
    
  },

  async show(req: Request, res: Response) {
    try {
      const tax = await Tax.findByPk(req.params.taxId)
      if (tax) {
        return res.json(tax)
      }
    } catch (error: any) {
      return res.status(400).render('error', { error })
    }
    return res.status(500)
  },

  async store(req: Request, res: Response) {
    try {
      const tax = await Tax.create({
        ...req.body,
        UserId: Number(req.body.UserId)
      })
      if (tax) {
        return res.status(201).json(tax)
      }
    } catch (err: any) {
      return res.status(400).json(err.errors[0])
    }
    return res.status(500).send(new Error('Unspecified error'))
  },

  async update(req: Request, res: Response) {
    try {
      const tax = await Tax.findOne({
        where: { 
          id: req.params.taxId,
          UserId: Number(req.body.UserId)
        }
      })
      if (tax) {
        await tax.update(req.body)
        return res.json(tax)
      }
    } catch (err: any) {
      return res.status(400).json(err.errors[0])
    }
    return res.status(500).send(new Error('Unspecified error'))
  },

  async destroy(req: Request, res: Response) {
    try {
      const tax = await Tax.destroy({
        where: {
          id: req.params.taxId,
          UserId: Number(req.body.UserId)
        }
      })
      if (tax) {
        return res.status(204).json({})
      }
    } catch (err: any) {
      return res.status(400).json(err.errors[0])
    }
    return res.status(500).send(new Error('Unspecified error'))
  }
}