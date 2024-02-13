// Create a Sequelize model for the Invoice table based on the mongoose model in ./Invoice.old.ts

import { Model, DataTypes, InferAttributes, InferCreationAttributes, Optional } from 'sequelize'
import { Expense, Payment, sequelize, Tax } from '@models/index'
import { _Invoice, _LineItem, _InvoiceStatus, _Tax, _TaxType } from '@jimmyjames88/freebooks-types'

const GUARDED = ['UserId', 'ClientId']

interface _InvoiceAttributes extends _Invoice {}
export interface _InvoiceCreationAttributes extends Optional<_InvoiceAttributes, 'id'> {}
export class Invoice extends Model<
  _InvoiceAttributes,
  _InvoiceCreationAttributes
> implements _InvoiceAttributes {
  public id!: number
  public UserId!: number
  public ClientId!: number
  public refNo!: string
  public status!: _InvoiceStatus
  public issueDate!: Date
  public dueDate!: Date
  public notes!: string
  public lineItems!: _LineItem[]
  public total!: number
  public Taxes!: Tax[]
  public Payments!: Payment[]
  public Expenses!: Expense[]
  public getTaxes!: Function
  public setTaxes!: Function
  public getExpenses!: Function
  public setExpenses!: Function
  public getPayments!: Function
  public setPayments!: Function
  public getClient!: Function
  public setClient!: Function
  public createPayment!: Function
  public createExpense!: Function
  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  public calculateSubtotal(): number {
    return this.lineItems.reduce((acc, item) => {
      if (!item.quantity || !item.rate) return acc
      return acc + (item.quantity * item.rate)
    }, 0)
  }

  public async tax(): Promise<number> {
    const taxes = await this.getTaxes()
    const subtotal = this.calculateSubtotal()
    console.log('SUBTOTAL: ', subtotal)
    return taxes.reduce((acc: number, tax: Tax) => {
      if (tax.type === _TaxType.PERCENTAGE) {
        return acc + (subtotal * tax.rate)
      } else {
        return acc + tax.rate
      }
    }, 0)
  }

  public async paymentsTotal(): Promise<number> {
    const payments = await this.getPayments()
    return payments.reduce((acc: number, payment: Payment) => acc + payment.amount, 0)
  }

  public async expensesTotal(): Promise<number> {
    const expenses = await this.getExpenses()
    return expenses.reduce(async (acc: Promise<number>, expense: Expense) => {
      return await acc + await expense.total()
    }, Promise.resolve(0))
  }

  public async calculateTotal(): Promise<number> {
    const value = this.calculateSubtotal()
      + await this.tax() 
      + await this.expensesTotal()
      - await this.paymentsTotal()

      console.log(this.calculateSubtotal(), await this.tax(), await this.expensesTotal(), await this.paymentsTotal(), value )

      return value
  }

  toJSON() {
    // todo - centralize
    let attributes = Object.assign({}, this.get())
    for (let a of GUARDED) {
      delete attributes[a as keyof _Invoice]
    }
    return attributes
  }
}

Invoice.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  refNo: DataTypes.STRING,
  status: DataTypes.ENUM(
    _InvoiceStatus.DRAFT,
    _InvoiceStatus.SENT,
    _InvoiceStatus.PARTIAL,
    _InvoiceStatus.PAID,
    _InvoiceStatus.VOID
  ),
  issueDate: DataTypes.DATE,
  dueDate: DataTypes.DATE,
  notes: DataTypes.STRING,
  lineItems: DataTypes.JSON,
  total: DataTypes.DECIMAL(10, 2),
  UserId: DataTypes.INTEGER,
  ClientId: DataTypes.INTEGER
}, {
  hooks: {
    async beforeSave(invoice, options) {
      console.log('BEFORESAVE!!!', await invoice.calculateTotal())
      invoice.total = await invoice.calculateTotal()
    }
  },
  sequelize: sequelize,
  modelName: 'Invoice',
  tableName: 'invoices'
})

