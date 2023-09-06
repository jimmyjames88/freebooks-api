import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import userRoutes from './users/routes'
import authRoutes from './auth/routes'
import clientRoutes from './clients/routes'
import invoiceRoutes from './invoices/routes'
console.log('#############', process.env.NODE_ENV)
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` })

const app = express()
const dbHost = 'mongodb://127.0.0.1'
const port = 3000

app.use(express.json())
app.use(cors())

app.use((req, res, next) => {
  if (req.headers['content-type'] === 'application/json') {
    const authHeader = req.headers['authorization'] as string
    if (authHeader) {
      const token = authHeader.split(" ")[1]
      const { userId } = jwt.decode(token) as any
      req.body.userId = userId
    }
  }
  
  next()
})

app.use('/users', userRoutes)
app.use('/auth', authRoutes)
app.use('/clients', clientRoutes)
app.use('/invoices', invoiceRoutes)

// server
const serve = async () => {
  try {
    await mongoose.connect(dbHost)
    app.listen(port, () => {
      console.log(`API server listening on port: ${port}`)
    })
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

serve()



