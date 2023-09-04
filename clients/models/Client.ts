import mongoose, { Schema } from 'mongoose'
import { AddressSchema } from '../../users/models/Address'

export const ClientSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: String,
  address: AddressSchema,
  phone: String,
  website: String,
  user: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  invoices:  [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Invoice',
    required: true
  }]
})

export const Client = mongoose.model('Client', ClientSchema)