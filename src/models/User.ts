import { Model, DataTypes, Optional } from 'sequelize'
import { _Profile, _User } from '@jimmyjames88/freebooks-types'
import { sequelize } from '@models/index'
import Client from './Client'
import Invoice from './Invoice'
import Profile from './Profile'
import Tax from './Tax'
import Payment from './Payment'

export default class User extends Model<_User, _UserInput> implements _User {
  public id!: number
  public email!: string
  public password!: string
  public name!: string
  public profile?: Profile
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

export interface _UserInput extends Optional<_User, 'id' | 'createdAt' | 'updatedAt'> {}
export interface _UserOutput extends Required<_User> {}

User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    validate: {
      min: 8
    },
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'user',
  tableName: 'users'
})

User.hasMany(Invoice)
User.hasMany(Client)
User.hasOne(Profile)
User.hasMany(Tax)
User.hasMany(Payment)
Invoice.belongsTo(User)
Invoice.belongsTo(Client)
Invoice.belongsToMany(Tax, { through: 'invoices_taxes' })
Invoice.hasMany(Payment)
Client.belongsTo(User)
Client.hasMany(Invoice)
Client.hasMany(Payment)
Profile.belongsTo(User)
Tax.belongsTo(User)
Tax.belongsToMany(Invoice, { through: 'invoices_taxes' })
Payment.belongsTo(Invoice)
Payment.belongsTo(User)
Payment.belongsTo(Client)
