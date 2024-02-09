import { Model, DataTypes, Optional } from 'sequelize'
import { sequelize } from '@models/index'

export interface _ExpensesTaxes {
  id: number
  ExpenseId: number
  TaxId: number
  createdAt: Date
  updatedAt: Date
}

export default class ExpensesTaxes extends Model<_ExpensesTaxes, _ExpensesTaxesInput> implements _ExpensesTaxes {
  public id!: number
  public ExpenseId!: number
  public TaxId!: number
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

export interface _ExpensesTaxesInput extends Optional<_ExpensesTaxes, 'id'> {}
export interface _ExpensesTaxesOutput extends Required<_ExpensesTaxes> {}

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

