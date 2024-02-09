import { Model, DataTypes, Optional } from 'sequelize'
import { _Address, _Profile } from '@jimmyjames88/freebooks-types'
import { sequelize } from '@models/index'

export class Profile extends Model<_Profile, _ProfileInput> implements _Profile {
  public UserId!: number
  public displayName!: string
  public displayEmail!: string
  public phone?: string
  public address!: _Address
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

export interface _ProfileInput extends Optional<_Profile, 'UserId' | 'displayName' | 'displayEmail' | 'address' | 'createdAt' | 'updatedAt'> {}
export interface _ProfileOutput extends Required<_Profile> {}

Profile.init({
  UserId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  phone: {
    type: DataTypes.STRING
  },
  displayName: {
    type: DataTypes.STRING
  },
  displayEmail: {
    type: DataTypes.STRING
  },
  address: {
    type: DataTypes.JSON
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
  modelName: 'Profile',
  tableName: 'profiles'
})
