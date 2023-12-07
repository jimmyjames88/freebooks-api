import express from 'express'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import { sequelize } from './src/models/index'
import userRoutes from './src/router/users'
import authRoutes from './src/router/auth'
import clientRoutes from './src/router/clients'
import invoiceRoutes from './src/router/invoices'
import process from 'process'

require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` })

const app = express()
const port = 3000

app.use(express.json())
app.use(cors())

app.use('/users', userRoutes)
app.use('/auth', authRoutes)
app.use('/clients', clientRoutes)
app.use('/invoices', invoiceRoutes)

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

sequelize.sync()
  .then(() => {
    console.log("Synced db.");
    serve()
  })
  .catch((err: Error) => {
    console.log("Failed to sync db: " + err.message);
  });

// server
const serve = async () => {
  try {
    app.listen(port, () => {
      console.log(`API server listening on port: ${port}`)
    })
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}




