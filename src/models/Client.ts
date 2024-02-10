import { DataTypes, InferAttributes, InferCreationAttributes, Model, Optional } from 'sequelize'
import { _Address, _Client } from '@jimmyjames88/freebooks-types'
import { Invoice, sequelize } from '@models/index'

const GUARDED = [ 'UserId', 'createdAt', 'updatedAt' ]
export class Client extends Model<
  InferAttributes<Client>,
  InferCreationAttributes<_ClientInput>
> implements _Client {
  public id!: number
  public name!: string
  public email!: string
  public phone?: string
  public website?: string
  public address?: _Address

  public UserId!: number
  public Invoices?: Invoice[]
  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  toJSON() {
    // todo - centralize
    let attributes = Object.assign({}, this.get())
    for (let a of GUARDED) {
      delete attributes[a as keyof InferAttributes<Client>]
    }
    return attributes
  }
}

export interface _ClientInput extends Optional<Client, 'id' | 'createdAt' | 'updatedAt'> {}

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
  UserId: DataTypes.INTEGER,
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE
}, {
  sequelize,
  modelName: 'Client',
  tableName: 'clients'
})
