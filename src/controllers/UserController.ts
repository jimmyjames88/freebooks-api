import { Request, Response } from 'express'
import { _User } from '@jimmyjames88/freebooks-types'
import User from '@models/User'

export default {
  async show(req: Request, res: Response) {
    const user = await User.findByPk(req.params.userId)
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