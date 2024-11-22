import { DataTypes, Model, Optional } from 'sequelize'
import { 
  _Address, _Client, _ClientInputCreate, _ClientInputUpdate
} from '@jimmyjames88/freebooks-types'
import { Invoice, User, sequelize } from '@models/index'

export class Client extends Model<
  Optional<_Client, 'Invoices' | 'User'>,
  _ClientInputCreate | _ClientInputUpdate
> implements _Client {
  public id!: number
  public name!: string
  public email!: string
  public phone!: string
  public website!: string
  public address!: _Address
  public Invoices!: Invoice[]
  public User!: User
  public UserId!: number
  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  toJSON() {
    // todo - centralize
    let attributes = Object.assign({}, this.get())
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
