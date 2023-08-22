import express from 'express'
import mongoose from 'mongoose'
import userRouter from './users/router'

const app = express()
const dbHost = 'mongodb://127.0.0.1'
const port = 3000

app.use(express.json())
app.use('/users', userRouter)

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



