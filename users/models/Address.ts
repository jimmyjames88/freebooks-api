import mongoose, { Schema } from 'mongoose'

export const AddressSchema = new Schema({
  line1: String,
  line2: String,
  city: String,
  province: String,
  postal: String,
  country: String
})