import { Request, Response } from 'express'
import { compare } from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { _User } from '@jimmyjames88/freebooks-types'
import User from '@models/User'

export default {
  
  async login(req: Request, res: Response) {
    const { email, password } = req.body
    const user = await User.findOne({ where: { email }})
    const match = user && await compare(password, user.password as string)
    if (match) {
      const token = jwt.sign(
        { userId: user.id },
        process.env.NODE_APP_SECRET as jwt.Secret,
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
    const { name, email, password }: _User = req.body

    const user = await User.create({
      name,
      email,
      password
    })

    return res.status(201).json(user)
  }
}