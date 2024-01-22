import { Model, DataTypes, Optional } from 'sequelize'
import { _Payment, _PaymentType } from '@jimmyjames88/freebooks-types'
import { sequelize } from '@models/index'

export default class Payment extends Model<_Payment, _PaymentInput> implements _Payment {
  public id!: number
  public userId!: number
  public clientId!: number
  public invoiceId!: number
  public date!: Date
  public description!: string
  public amount!: number
  public type!: _PaymentType
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

export interface _PaymentInput extends Optional<_Payment, 'id'> {}
export interface _PaymentOutput extends Required<_Payment> {}

Payment.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  clientId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  invoiceId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  type: {
    type: DataTypes.JSON,
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
  modelName: 'payment',
  tableName: 'payments'
})
