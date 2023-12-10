import { Model, DataTypes } from 'sequelize'
import { sequelize } from '@models/index'
import Invoice from './Invoice'
import Client from './Client'

export default class User extends Model {
  declare id: number
  declare email: string
  declare password: string
  declare name: string
  declare createdAt: Date
  declare updatedAt: Date
}

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
