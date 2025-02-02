import { Model, DataTypes, Optional } from 'sequelize'
import {
  _Expense, _ExpenseInputCreate, _ExpenseInputUpdate, _TaxType
} from '@jimmyjames88/freebooks-types'
import { sequelize, Invoice, PaymentType, Tax } from '@models/index'

export class Expense extends Model<
  Optional<_Expense, 'PaymentType' | 'Taxes' | 'Invoice'>,
  _ExpenseInputCreate | _ExpenseInputUpdate
> implements _Expense {
  public id!: number
  public UserId!: number
  public InvoiceId!: number | null
  public Invoice!: Invoice
  public PaymentType!: PaymentType
  public PaymentTypeId!: number
  public date!: Date
  public description!: string
  public subtotal!: number
  public Taxes!: Tax[]
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
  public getTaxes!: Function
  public setTaxes!: Function
  public setInvoice!: Function
  public getInvoice!: Function

  public async total(): Promise<number> {
    const taxes = await this.getTaxes()
    for (let tax of taxes) {
      if (tax.type === _TaxType.PERCENTAGE) {
        return this.subtotal + (this.subtotal * tax.rate)
      }
      return this.subtotal + tax.rate
    }
    return this.subtotal
  }
}

Expense.init({
  id: {
    allowNull: false,
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  UserId: DataTypes.INTEGER,
  InvoiceId: DataTypes.INTEGER,
  PaymentTypeId: DataTypes.INTEGER,
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
