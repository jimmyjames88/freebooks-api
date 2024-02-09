import express from 'express'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import { sequelize } from './src/models/index'
import authRoutes from './src/router/auth'
import clientRoutes from './src/router/clients'
import dashboardRoutes from './src/router/dashboard'
import expenseRoutes from './src/router/expenses'
import invoiceRoutes from './src/router/invoices'
import paymentRoutes from './src/router/payments'
// import reportRoutes from './src/router/reports'
import taxRoutes from './src/router/taxes'
import userRoutes from './src/router/users'
import process from 'process'

require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` })

const app = express()
const port = 3000

app.use(express.json())
app.use(cors())

app.use('/auth', authRoutes)
app.use('/clients', clientRoutes)
app.use('/dashboard', dashboardRoutes)
app.use('/expenses', expenseRoutes)
app.use('/invoices', invoiceRoutes)
app.use('/payments', paymentRoutes)
// app.use('/reports', reportRoutes)
app.use('/taxes', taxRoutes)
app.use('/users', userRoutes)

app.use((req, res, next) => {
  if (req.headers['content-type'] === 'application/json') {
    const authHeader = req.headers['authorization'] as string
    if (authHeader) {
      const token = authHeader.split(" ")[1]
      const { UserId } = jwt.decode(token) as any
      req.body.UserId = UserId
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




