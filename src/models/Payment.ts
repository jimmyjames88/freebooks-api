import { Model, DataTypes, Optional } from 'sequelize'
import { _Payment, _PaymentType } from '@jimmyjames88/freebooks-types'
import { sequelize } from '@models/index'

export class Payment extends Model<_Payment, _PaymentInput> implements _Payment {
  public id!: number
  public UserId!: number
  public ClientId!: number
  public InvoiceId!: number
  public paymentTypeId!: number
  public date!: Date
  public description!: string
  public amount!: number
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
  UserId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  ClientId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  InvoiceId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  paymentTypeId: {
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
  modelName: 'Payment',
  tableName: 'payments'
})
