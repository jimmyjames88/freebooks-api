import { Request, Response } from 'express'
import { Profile, User } from '@models/index'

export default {
  async show(req: Request, res: Response) {
    const user: User | null = await User.findByPk(req.body.UserId, { include: Profile })
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
    const { profile }: User = req.body
    const user: User | null = await User.findByPk(req.body.UserId, { include: { model: Profile }})
    if (user)  {
      user.profile?.set({ ...profile })
      await user.profile?.save()
      await user.save()
      return res.status(200).json(user)
    }
    return res.status(404).json({})
  },

  async destroy(req: Request, res: Response) {
    const user = await User.findByPk(req.params.UserId)
    if (user)
      await user.destroy()
    return res.json(user)
  }
}