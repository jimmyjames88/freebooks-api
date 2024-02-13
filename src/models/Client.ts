import { DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute, Optional } from 'sequelize'
import { _Address, _Client } from '@jimmyjames88/freebooks-types'
import { Invoice, User, sequelize } from '@models/index'

const GUARDED = [ 'UserId', 'createdAt', 'updatedAt' ]

interface _ClientAttributes extends Omit<_Client, 'Invoices' | 'User'> {
  UserId: number
  createdAt: Date
  updatedAt: Date
}
export interface _ClientCreationAttributes extends Optional<_ClientAttributes, 'id'> {}

export class Client extends Model<
  _ClientAttributes,
  _ClientCreationAttributes
> implements _ClientAttributes {
  public id!: number
  public name!: string
  public email!: string
  public phone?: string
  public website?: string
  public address!: _Address
  public Invoices?: Invoice[]
  public User!: User
  public UserId!: number
  
  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  toJSON() {
    // todo - centralize
    let attributes = Object.assign({}, this.get())
    for (let a of GUARDED) {
      delete attributes[a as keyof _ClientAttributes]
    }
    return attributes
  }
}

Client.init({
  id: {
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
