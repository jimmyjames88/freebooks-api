import express, { Request, Response, NextFunction } from 'express'
import { hash } from 'bcryptjs'
import { User } from '../models/User'

export default {
  async index(req: Request, res: Response) {
    const users = await User.find()
    res.json(users)
  },

  async show(req: Request, res: Response) {
    const user = await User.findById(req.params.userId)
    res.json(user)
  },

  async create(req: Request, res: Response) {
    const { email, password, profile } = req.body
    const hashedPassword = await hash(password, 10)
    const user = await User.create({
      email,
      password: hashedPassword,
      profile
    })
    res.json(user)
  },

  async update(req: Request, res: Response) {
    const user = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { ...req.body },
      {
        new: true,
        fields: {
          email: 1,
          password: 1
        }
      }
    )
    res.json(user)
  },

  async destroy(req: Request, res: Response) {
    const user = await User.findByIdAndRemove(req.params.userId)
    res.json(user)
  }
}