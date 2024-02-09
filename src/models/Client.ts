import { Model, DataTypes, Optional } from 'sequelize'
import { _Address, _Client } from '@jimmyjames88/freebooks-types'
import { sequelize } from '@models/index'
import Invoice from './Invoice'


export default class Client extends Model<_Client, _ClientInput> implements _Client {
  public id!: number
  public name!: string
  public email!: string
  public phone!: string
  public website!: string
  public address!: _Address
  public UserId?: number
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
  public invoices?: Invoice[]
}

export interface _ClientInput extends Optional<_Client, 'email' | 'phone' | 'website' | 'address'> {}
export interface _ClientOutput extends Required<_Client> {}

Client.init({
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
  email: {
    type: DataTypes.STRING
  },
  phone: DataTypes.STRING,
  website: DataTypes.STRING,
  address: DataTypes.JSON,
  UserId: DataTypes.INTEGER
}, {
  sequelize,
  modelName: 'Client',
  tableName: 'clients'
})
