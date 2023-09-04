import { Schema } from 'mongoose'
import { AddressSchema } from './Address'

export const ProfileSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  companyName: String,
  phone: String,
  website: String,
  address: AddressSchema
})
