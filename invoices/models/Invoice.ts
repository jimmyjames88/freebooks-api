import mongoose, { Schema } from 'mongoose'
import { LineItemSchema } from './LineItem'

export const InvoiceSchema = new Schema({
  ref: {
    type: String
  },
  date: {
    type: Date
  },
  notes: {
    type: String
  },
  lineItems: {
    type: [LineItemSchema]
  },
  subtotal: {
    type: Number
  },
  tax: {
    type: Number
  },
  total: {
    type: Number
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
})

export const Invoice = mongoose.model('Invoice', InvoiceSchema)