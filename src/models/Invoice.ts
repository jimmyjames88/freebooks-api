// Create a Sequelize model for the Invoice table based on the mongoose model in ./Invoice.old.ts

import { Model, DataTypes, Optional } from 'sequelize'
import { sequelize } from '@models/index'
import { _Invoice, _LineItem, _InvoiceStatus } from '@jimmyjames88/freebooks-types'
import Tax from './Tax'

export default class Invoice extends Model<_Invoice, _InvoiceInput> implements _Invoice {
  public id!: number
  public userId!: number
  public clientId?: number
  public refNo!: string
  public status!: _InvoiceStatus
  public issueDate!: Date
  public dueDate!: Date
  public notes!: string
  public lineItems!: _LineItem[]
  public total!: number
  public taxes!: Tax[]
  public setTaxes!: Function
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

export interface _InvoiceInput extends Optional<_Invoice, 'total'> {}
export interface _InvoiceOutput extends Required<_Invoice> {}

Invoice.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  refNo: DataTypes.STRING,
  status: DataTypes.ENUM(
    _InvoiceStatus.DRAFT,
    _InvoiceStatus.SENT,
    _InvoiceStatus.PARTIAL,
    _InvoiceStatus.PAID,
    _InvoiceStatus.VOID
  ),
  issueDate: DataTypes.DATE,
  dueDate: DataTypes.DATE,
  notes: DataTypes.STRING,
  lineItems: DataTypes.JSON,
  total: DataTypes.DECIMAL(10, 2),
  userId: DataTypes.INTEGER,
  clientId: DataTypes.INTEGER
}, {
  sequelize: sequelize,
  modelName: 'invoice',
  tableName: 'invoices'
})

