import mongoose, { Schema } from 'mongoose'
import { ProfileSchema } from './Profile'

const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    minlength: 8,
    required: true
  },
  profile: ProfileSchema
}, { 
  timestamps: true,
  toJSON: {
    transform(doc, ret) {
      delete ret.password
    }
  }
})

export interface IUser {
  email: string
  password: string
  profile: any
}

export const User = mongoose.model('User', UserSchema)