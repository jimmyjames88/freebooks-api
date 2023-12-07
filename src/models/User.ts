import { Model, DataTypes } from 'sequelize'
import { sequelize } from '@models/index'
import { Invoice } from './Invoice'
import { Client } from './Client'

export class User extends Model {
  declare id: number
  declare email: string
  declare password: string
  declare name: string
  declare createdAt: Date
  declare updatedAt: Date

  associate() {
    User.hasMany(Invoice)
    User.hasMany(Client)
  }
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
  tableName: 'users'
})
