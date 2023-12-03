// Create a Sequelize model for the Client table based on the mongoose model in ./Client.old.ts

import { Model, DataTypes } from 'sequelize'
import { sequelize } from '@models/index'
import { Invoice } from './Invoice'
import { User } from './User'

export class Client extends Model {
  declare id: number
  declare name: string
  declare email: string
  declare phone: string
  declare website: string

  associate() {
    Client.belongsTo(User)
    Client.hasMany(Invoice)
  }
}

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
  userId: DataTypes.INTEGER
}, {
  sequelize,
  tableName: 'clients'
})
