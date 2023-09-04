import { Request, Response } from 'express'
import { compare } from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { IUser, User } from '../../users/models/User'

export default {
  
  async login(req: Request, res: Response) {
    const { email, password } = req.body
    const user = await User.findOne({ email })

    const match = user && await compare(password, user.password as string)
    if (match) {
      const token = jwt.sign(
        { userId: user._id },
        process.env.APP_SECRET as jwt.Secret,
        { expiresIn: "15 minutes" }
      )
      return res.status(200).json({
        user,
        token: `Bearer ${token}`
      })
    }
    return res.status(401).json({})
  },

  async register(req: Request, res: Response) {
    const { email, password, profile } = req.body

    const user = User.create({
      email,
      password,
      profile
    })

    return res.status(201).json(user)
  }
}