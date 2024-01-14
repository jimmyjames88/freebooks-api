import { Request, Response } from 'express'
import { _User } from '@jimmyjames88/freebooks-types'
import User from '@models/User'
import Profile from '@models/Profile'

export default {
  async show(req: Request, res: Response) {
    const user: _User | null = await User.findByPk(req.body.userId, { include: Profile })
    if (user) {
      return res.json({
        id: user.id,
        email: user.email,
        name: user.name,
        profile: user.profile
      })
    }
    return res.status(404).json({})
  },

  async update(req: Request, res: Response) {
    const { name, profile }: _User = req.body
    const user = await User.update({
      name
    }, {
      where: {
        id: Number(req.body.userId) 
      }
    })
    if (user) {
      await Profile.update({ ...profile }, {
        where: {
          userId: Number(req.body.userId)
        }
      })
      return res.json(user).status(200)
    }
    return res.status(404).json({})
  },

  async destroy(req: Request, res: Response) {
    const user = await User.findByPk(req.params.userId)
    if (user)
      await user.destroy()
    return res.json(user)
  }
}