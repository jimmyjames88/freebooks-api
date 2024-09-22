// Create a Sequelize model for the Client table based on the mongoose model in ./Client.old.ts

import { Model, DataTypes, Optional } from 'sequelize'
import { _Tax, _TaxType, _TaxInputCreate, _TaxInputUpdate } from '@jimmyjames88/freebooks-types'
import { sequelize } from '@models/index'


export class Tax extends Model<
  _Tax,
  _TaxInputCreate | _TaxInputUpdate
> implements _Tax {
  public id!: number
  public UserId!: number
  public name!: string
  public rate!: number
  public type!: _TaxType
  public default!: boolean
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

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
  UserId: DataTypes.INTEGER,
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
  modelName: 'Tax',
  tableName: 'taxes'
})
