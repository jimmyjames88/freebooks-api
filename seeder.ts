import express from 'express'
import mongoose from 'mongoose'
import { faker } from '@faker-js/faker'
import { hash } from 'bcryptjs'
import 'dotenv/config'
import userRoutes from './users/routes'
import authRoutes from './auth/routes'
import clientRoutes from './clients/routes'
import invoiceRoutes from './invoices/routes'
import { Client } from './clients/models/Client'
import { Invoice } from './invoices/models/Invoice'
import { User } from './users/models/User'

const app = express()
const dbHost = 'mongodb://127.0.0.1'

// server
const serve = async () => {
  try {
    await mongoose.connect(dbHost)
    seed()
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}
serve()

const userList = [
  { name: 'James', email: 'me@james-allen.ca', password: 'helloworld' },
  { name: 'Guest', email: 'guest', password: 'guest' }
]

const seed = async () => {
  userList.forEach(async item => {
    const password = await hash(item.password, 10)
    const user = new User({
      name: item.name,
      email: item.email,
      password
    })
    await user.save()

    console.log('User created: ', user)

    // clients
    for(let i=0; i < 5; i++) {
      const client = new Client({
        name: faker.company.name(),
        address: {
          line1: faker.location.streetAddress(),
          line2: faker.location.secondaryAddress(),
          city: faker.location.city(),
          province: faker.location.state(),
          postalCode: faker.location.zipCode(),
          country: faker.location.country()
        },
        phone: faker.phone.number(),
        email: faker.internet.email(),
        website: faker.internet.url(),
        user
      })
      await client.save()

      // invoices
      for(let i=0; i < 3; i++) {
        const subtotal = faker.number.float({ precision: 2 })
        const tax = 0.05
        const invoice = new Invoice({
          client,
          user,
          ref: faker.string.alphanumeric(8),
          date: faker.date.recent(),
          notes: faker.lorem.paragraph(),
          lineItems: [
            {
              description: faker.commerce.productName(),
              quantity: faker.number.int({ min: 1, max: 10 }),
              rate: faker.number.float({ precision: 2 }),
              type: 'Service'
            }
          ],
          subtotal,
          tax,
          total: (subtotal + (subtotal * tax)).toFixed(2)
        })
        
        await invoice.save()
      }
    }
  })
}
