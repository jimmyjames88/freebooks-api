import { Model, DataTypes, Optional } from 'sequelize'
import { sequelize } from '@models/index'

export interface _ExpensesTaxes {
  id: number
  ExpenseId: number
  TaxId: number
  createdAt: Date
  updatedAt: Date
}

export class ExpensesTaxes extends Model<
  _ExpensesTaxes,
  Optional<_ExpensesTaxes, 'id'>
> implements _ExpensesTaxes {
  public id!: number
  public ExpenseId!: number
  public TaxId!: number
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

ExpensesTaxes.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  ExpenseId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Expense',
      key: 'id'
    }
  },
  TaxId: { 
    type: DataTypes.INTEGER,
    references: {
      model: 'Tax',
      key: 'id'
    }
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
  sequelize: sequelize,
  modelName: 'ExpensesTaxes',
  tableName: 'expenses_taxes'
})

