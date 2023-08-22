import mongoose, { Schema } from 'mongoose'

const AddressSchema = new Schema({
  line1: String,
  line2: String,
  city: String,
  province: String,
  postal: String,
  country: String
})

export const ProfileSchema = new Schema({
  firstName: String,
  lastName: String,
  companyName: String,
  phone: String,
  address: AddressSchema
})
