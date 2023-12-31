import { Model, DataTypes, Optional } from 'sequelize'
import { _User } from '@jimmyjames88/freebooks-types'
import { sequelize } from '@models/index'
import Invoice from './Invoice'
import Client from './Client'

export default class User extends Model<_User, _UserInput> implements _User {
  public id!: number
  public email!: string
  public password!: string
  public name!: string
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
Invoice.belongsTo(User)
Client.belongsTo(User)
Client.hasMany(Invoice)
Invoice.belongsTo(Client)
