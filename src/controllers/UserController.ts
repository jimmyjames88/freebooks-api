import { Request, Response } from 'express'
import { compare, hash } from 'bcryptjs'
import { User } from '@models/User'

export default {
  async show(req: Request, res: Response) {
    const user = await User.findByPk(req.params.userId)
    return res.json(user)
  },

  async store(req: Request, res: Response) {
    const { email, password } = req.body
    const hashedPassword = await hash(password, 10)
    const user = await User.create({
      email,
      password: hashedPassword
    })
    return res.json(user)
  },

  async update(req: Request, res: Response) {
    const user = await User.findByPk(req.params.userId)
    const { email, password } = req.body
    if (user) {
      user?.set({ email, password })
      await user?.save()
    }
    return res.json(user)
  },

  async destroy(req: Request, res: Response) {
    const user = await User.findByPk(req.params.userId)
    if (user)
      await user.destroy()
    return res.json(user)
  }
}