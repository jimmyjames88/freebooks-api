import { Request, Response } from 'express'
import { User } from '../models/User'

export default {
  async update(req: Request, res: Response) {
    const user = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { ...req.body },
      {
        new: true,
        fields: {
          profile: {
            name: 1,
            companyName: 1,
            phone: 1,
            website: 1,
            address: 1
          }
        }
      }
    )
    console.log('######', user)
    res.json({})
  }
}