import { Model, DataTypes, Optional } from 'sequelize'
import { _Payment, _PaymentType } from '@jimmyjames88/freebooks-types'
import { sequelize } from '@models/index'

export class PaymentType extends Model<_PaymentType, _PaymentTypeInput> implements _PaymentType {
  public id!: number
  public name!: string
  public icon!: string
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

export interface _PaymentTypeInput extends Optional<_PaymentType, 'id' | 'createdAt' | 'updatedAt'> {}
export interface _PaymentOutputType extends Required<_PaymentType> {}

PaymentType.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  icon: {
    type: DataTypes.STRING
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
  modelName: 'PaymentType',
  tableName: 'paymentTypes'
})
