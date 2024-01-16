// Create a Sequelize model for the Client table based on the mongoose model in ./Client.old.ts

import { Model, DataTypes, Optional } from 'sequelize'
import { _Tax, _TaxType } from '@jimmyjames88/freebooks-types'
import { sequelize } from '@models/index'


export default class Tax extends Model<_Tax, _TaxInput> implements _Tax {
  public id!: number
  public userId!: number
  public name!: string
  public rate!: number
  public type!: _TaxType
  public default!: boolean
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

export interface _TaxInput extends Optional<_Tax, 'userId'> {}
export interface _TaxOutput extends Required<_Tax> {}

Tax.init({
  id: {
    allowNull: false,
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  rate: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('PERCENTAGE', 'FLAT'),
    allowNull: false
  },
  default: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  userId: DataTypes.INTEGER,
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
  modelName: 'tax',
  tableName: 'taxes'
})
