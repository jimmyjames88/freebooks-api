import { Model, DataTypes, Optional } from 'sequelize'
import { _Expense, _PaymentType, _Tax, _TaxType } from '@jimmyjames88/freebooks-types'
import { sequelize } from '@models/index'

export class Expense extends Model<_Expense, _ExpenseInput> implements _Expense {
  public id!: number
  public UserId!: number
  public InvoiceId?: number
  public paymentTypeId!: number
  public date!: Date
  public description!: string
  public subtotal!: number
  public Taxes!: _Tax[]
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
  public getTaxes!: Function

  public total(): number {
    return this.subtotal
    // const taxes = await this.getTaxes()
    // return this.subtotal + taxes.reduce((acc: number, tax: _Tax) => {
    //   if (tax.type === _TaxType.FLAT) return acc + tax.rate
    //   if (tax.type === _TaxType.PERCENTAGE) return acc + (this.subtotal * (tax.rate * 100))
    //   return acc
    // }, 0)
  }
}

export interface _ExpenseInput extends Optional<_Expense, 'InvoiceId'> {}
export interface _ExpenseOutput extends Required<_Expense> {}

Expense.init({
  id: {
    allowNull: false,
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  UserId: DataTypes.INTEGER,
  InvoiceId: DataTypes.INTEGER,
  paymentTypeId: DataTypes.INTEGER,
  date: DataTypes.DATE,
  description: DataTypes.STRING,
  subtotal: DataTypes.DECIMAL(8, 2),
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
  modelName: 'Expense',
  tableName: 'expenses'
})
