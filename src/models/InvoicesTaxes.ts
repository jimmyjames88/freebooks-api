import { Model, DataTypes, Optional } from 'sequelize'
import { sequelize } from '@models/index'
import { _Invoice, _LineItem, _InvoiceStatus } from '@jimmyjames88/freebooks-types'

export interface _InvoicesTaxes {
  id: number
  InvoiceId: number
  TaxId: number
  createdAt: Date
  updatedAt: Date
}

export class InvoicesTaxes extends Model<
  _InvoicesTaxes,
  Optional<_InvoicesTaxes, 'id'>
> implements _InvoicesTaxes {
  public id!: number
  public InvoiceId!: number
  public TaxId!: number
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

InvoicesTaxes.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  InvoiceId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Invoices',
      key: 'id'
    }
  },
  TaxId: { 
    type: DataTypes.INTEGER,
    references: {
      model: 'Taxes',
      key: 'id'
    }
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
  sequelize: sequelize,
  modelName: 'InvoicesTaxes',
  tableName: 'invoices_taxes'
})

