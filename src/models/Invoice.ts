// Create a Sequelize model for the Invoice table based on the mongoose model in ./Invoice.old.ts

import { Model, DataTypes } from 'sequelize'
import { sequelize } from '@models/index'
import { Client } from './Client'
import { User } from './User'

export class Invoice extends Model {
  declare id: number
  declare ref: string
  declare date: Date
  declare notes: string
  declare subtotal: number
  declare tax: number
  declare total: number

  associate() {
    Invoice.belongsTo(User)
    Invoice.belongsTo(Client)
  }
}

Invoice.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  ref: DataTypes.STRING,
  date: DataTypes.DATE,
  notes: DataTypes.STRING,
  subtotal: DataTypes.DECIMAL,
  tax: DataTypes.DECIMAL,
  total: DataTypes.DECIMAL
}, {
  sequelize: sequelize,
  tableName: 'invoices'
})