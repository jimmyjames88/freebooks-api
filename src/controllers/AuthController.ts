import { Request, Response } from 'express'
import { compare, hash } from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { _User } from '@jimmyjames88/freebooks-types'
import { Profile, User } from '@models/index'

export default {
  
  async login(req: Request, res: Response) {
    const { email, password } = req.body
    const user = await User.findOne({ where: { email }, include: Profile })
    const match = user && await compare(password, user.password as string)
    if (match) {
      const token = jwt.sign(
        { UserId: user.id },
        process.env.NODE_APP_SECRET as jwt.Secret,
        { expiresIn: "15 minutes" }
      )
      const refreshToken = jwt.sign(
        { UserId: user.id },
        process.env.NODE_APP_SECRET as jwt.Secret,
        { expiresIn: "1 hour" }
      )
      return res.status(200).json({
        user,
        token: `Bearer ${token}`,
        refreshToken
      })
    }
    return res.status(401).json({})
  },

  async refresh (req: Request, res: Response) {
    const { refreshToken } = req.body
    try {
      const { UserId } = jwt.verify(refreshToken, process.env.NODE_APP_SECRET as jwt.Secret) as { UserId: number }
      const user = await User.findOne({ where: { id: UserId }, include: Profile })
      if (user) {
        const token = jwt.sign(
          { UserId: user.id },
          process.env.NODE_APP_SECRET as jwt.Secret,
          { expiresIn: "15 minutes" }
        )
        return res.status(200).json({ token: `Bearer ${token}` })
      }
    } catch (err) {
      return res.status(403).json({})
    }
    return res.status(401).json({})
  },

  async register(req: Request, res: Response) {
    const { name, email, password }: _User = req.body

    const user = await User.create({
      name,
      email,
      password: await hash(String(password), 10)
    })

    await Profile.create({
      UserId: user.id,
      displayEmail: email,
      displayName: name,
      phone: '',
      address: {
        line1: '',
        line2: '',
        city: '',
        state: '',
        postal: '',
        country: ''
      }
    })

    return res.status(201).json(user)
  },

  async checkEmail(req: Request, res: Response) {
    const { email } = req.body
    console.log('EMAIL')
    const user = await User.findOne({ where: { email } })
    return res.status(200).json({ exists: !!user })
  }
}