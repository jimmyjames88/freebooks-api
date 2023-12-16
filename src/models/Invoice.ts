// Create a Sequelize model for the Invoice table based on the mongoose model in ./Invoice.old.ts

import { Model, DataTypes } from 'sequelize'
import { sequelize } from '@models/index'

export enum InvoiceStatus {
  DRAFT = 'draft',
  SENT = 'sent',
  PARTIAL = 'partial',
  PAID = 'paid',
  VOID = 'void'
}

export default class Invoice extends Model {
  declare id: number
  declare ref: string
  declare status: InvoiceStatus
  declare date: Date
  declare notes: string
  declare address: object
  declare lineItems: object
  declare subtotal: number
  declare tax: number
  declare total: number
}

Invoice.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  refNo: DataTypes.STRING,
  status: DataTypes.ENUM(
    InvoiceStatus.DRAFT,
    InvoiceStatus.SENT,
    InvoiceStatus.PARTIAL,
    InvoiceStatus.PAID,
    InvoiceStatus.VOID
  ),
  date: DataTypes.DATE,
  notes: DataTypes.STRING,
  address: DataTypes.JSON,
  lineItems: DataTypes.JSON,
  subtotal: DataTypes.DECIMAL,
  tax: DataTypes.DECIMAL,
  total: DataTypes.DECIMAL,
  userId: DataTypes.INTEGER,
  clientId: DataTypes.INTEGER
}, {
  sequelize: sequelize,
  modelName: 'invoice',
  tableName: 'invoices'
})

