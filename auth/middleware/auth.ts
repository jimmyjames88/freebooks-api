import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

function validateToken(token: string, req: Request) {
  let valid = null
  jwt.verify(
    token,
    process.env.APP_SECRET || '',
    (err, decoded: any) => {
      if (!err) {
        valid = decoded
        if (req.body) {
          req.body.userId = decoded.userId
        } else {
          req.body = { userId: decoded.userId }
        }
      }
    }
  )
  return valid
}

function checkGroup() {
  return true
}

export default (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization']
  
  if (!authHeader)
    return res.sendStatus(401)

  const token: string = authHeader.split(' ')[1]
  
  if (validateToken(token, req) && checkGroup()) {
    return next()
  }
  return res.sendStatus(401)
}