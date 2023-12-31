import { Request, Response, NextFunction } from 'express'
import jwt, { JwtPayload, VerifyCallback, VerifyOptions } from 'jsonwebtoken'

function validateToken(token: string, req: Request) {
  let valid = null
  jwt.verify(
    token,
    process.env.NODE_APP_SECRET || '',
    (err, decoded: any) => {
      if (!err) {
        valid = decoded
        if (req.body) {
          // todo: evaluate this... is slapping userID here really a good idea? Could be spoofed?
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