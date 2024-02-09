import { Model, DataTypes, Optional } from 'sequelize'
import { _Profile, _User } from '@jimmyjames88/freebooks-types'
import { 
  Client, Expense, Invoice, Payment, PaymentType, Profile, sequelize, Tax
} from '@models/index'

export class User extends Model<_User, _UserInput> implements _User {
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
  modelName: 'User',
  tableName: 'users'
})

User.hasMany(Client)
User.hasMany(Expense)
User.hasMany(Invoice)
User.hasMany(Payment)
User.hasOne(Profile)
User.hasMany(Tax)
Invoice.belongsTo(Client)
Invoice.hasMany(Expense)
Invoice.hasMany(Payment)
Invoice.belongsToMany(Tax, { through: 'invoices_taxes' })
Invoice.belongsTo(User)
Client.belongsTo(User)
Client.hasMany(Invoice)
Client.hasMany(Payment)
Profile.belongsTo(User)
Tax.belongsTo(User)
Tax.belongsToMany(Expense, { through: 'expenses_taxes' })
Tax.belongsToMany(Invoice, { through: 'invoices_taxes' })
Payment.belongsTo(Client)
Payment.belongsTo(Invoice)
Payment.belongsTo(PaymentType)
Payment.belongsTo(User)
Expense.belongsTo(Invoice)
Expense.belongsTo(PaymentType)
Expense.belongsToMany(Tax, { through: 'expenses_taxes' })
Expense.belongsTo(User)
PaymentType.hasMany(Expense)
PaymentType.hasMany(Payment)
