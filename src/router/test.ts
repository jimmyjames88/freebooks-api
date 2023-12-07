import express, { Request, Response } from 'express'
import { User } from '@models/User'

const router = express.Router()

router.post('/', async(req: Request, res: Response) => {
  // Get user 1
  const user = await User.findOne(1)
  // Log a list of clients belonging to user 1
  console.log('USER----->', user)
  })

export default router