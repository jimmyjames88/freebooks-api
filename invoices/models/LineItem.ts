import mongoose, { Schema } from 'mongoose'

export const LineItemSchema = new Schema({
  type: {
    type: String
  },
  description: {
    type: String
  },
  quantity: {
    type: Number
  },
  rate: {
    type: Number
  }
})