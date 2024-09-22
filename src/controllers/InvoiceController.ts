import { Request, Response } from 'express'
import { Op, FindOptions } from 'sequelize'
import { 
  _Expense, _Invoice, _InvoiceStatus, _InvoiceInputCreate, _LineItem, _Payment, _Tax
} from '@jimmyjames88/freebooks-types'
import { 
  Client, Expense, Invoice, Payment, PaymentType, Profile, Tax, User
} from '@models/index'

// todo centralize

export interface TypedResponse<T> extends Response {
  body: T
}

const saveExpenses = async (invoice: Invoice, expenses: _Expense[]) => {
  // compare incoming expenses with existing expenses - unassociate them from this invoice if they are not in the incoming list
  const existingExpenses = await Expense.findAll({ where: { InvoiceId: invoice.id } })
  if (existingExpenses) {
    for (let existingExpense of existingExpenses) {
      if (!expenses.find((expense: _Expense) => expense.id === existingExpense.id)) {
        await existingExpense.update({ InvoiceId: null })
      }
    }
  }

  // create new expenses and update existing ones
  if (expenses) {
    for (let expense of expenses) {
      if (expense.id) {
        const existingExpense = await Expense.findByPk(expense.id)
        if (existingExpense) {
          existingExpense.set({ ...expense, InvoiceId: invoice.id })
          await existingExpense.save()
        }
      } else {
        try {
          expense.UserId = Number(invoice.UserId)
          await invoice.createExpense({ ...expense })
        } catch (err: any) {
          console.warn(err)                  
        }
      }
    }
  }
}

const savePayments = async(invoice: Invoice, payments: _Payment[]) => {
  // compare incoming payments with existing payments - delete any that are not in the incoming list
  const existingPayments = await Payment.findAll({ where: { InvoiceId: invoice.id } })
  if (existingPayments) {
    for (let existingPayment of existingPayments) {
      if (!payments.find((payment: _Payment) => payment.id === existingPayment.id)) {
        await existingPayment.destroy()
      }
    }
  }
  // create new payments and update existing ones
  if (payments) {
    for (let payment of payments) {
      if (payment.id) {
        const existingPayment = await Payment.findByPk(payment.id)
        if (existingPayment) {
          existingPayment.set({ ...payment, InvoiceId: invoice.id })
          await existingPayment.save()
        }
      } else {
        try {
          payment.UserId = Number(invoice.UserId)
          await invoice.createPayment({ ...payment })
        } catch (err: any) {
          console.warn(err)
        }
      }
    }
  }
}

const saveAssociations = async (invoice: Invoice, data: _InvoiceInputCreate ) => {
  invoice.setTaxes(data.Taxes?.map((tax: _Tax) => tax.id))
  invoice.setClient(data.Client?.id)
  
  if (data.Payments) savePayments(invoice, data.Payments)
  if (data.Expenses) saveExpenses(invoice, data.Expenses)

  await invoice.save()
}

export default {
  async index(req: Request, res: Response) {
    const options: FindOptions = {
      attributes: { include: ['total'], exclude: ['LineItems'] },
      where: { 
        UserId: Number(req.body.UserId),
      },
      offset: (Number(req.query.page) - 1) * Number(req.query.itemsPerPage || 10) || 0,
      limit: Number(req.query.itemsPerPage) || 10,
      include: [{
        model: Client,
        attributes: [ 'id', 'name' ]
      }]
    } 
    if (req.query.search) {
      options.where = {
        ...options.where,
        [Op.or]: [
          { 'refNo': { [Op.like]: '%' + req.query.search + '%' } },
          { '$client.name$': { [Op.like]: '%' + req.query.search + '%' } }
        ]
      }
    }
    if (req.query.sortBy) {
      let [ sortBy ] = req.query.sortBy as any
      if (sortBy.key.toLowerCase() === 'client.name') {
        options.order = [ [{ model: Client, as: 'Client' }, 'name', sortBy.order] ]
      } else {
        options.order = [[ sortBy.key, sortBy.order ]]
      }
    }
    if (req.query.ClientId) {
      options.where = {
        ...options.where,
        ClientId: req.query.ClientId
      }
    }
    if (req.query.filters) {
      const filters = req.query.filters as any
      if (filters.custom.pastDue) {
        options.where = {
          ...options.where,
          dueDate: { [Op.lt]: new Date() },
          status: [
            _InvoiceStatus.DRAFT,
            _InvoiceStatus.SENT,
            _InvoiceStatus.PARTIAL
          ]
        }
      }
    }

    const invoices = await Invoice.findAll(options)
    const total = await Invoice.count({ include: Client, where: options.where })
    if (!invoices)
      return res.sendStatus(404)
    return res.json({
      items: invoices,
      total
    })
  },

  async show(req: Request, res: Response) {
    try {
      const invoice = await Invoice.findOne({
        where: {
          id: Number(req.params.InvoiceId),
          UserId: Number(req.body.UserId)
        },
        include: [
          { model: Client },
          { model: User, attributes: ['id'], include: [ { model: Profile } ] },
          { model: Tax },
          { model: Payment, include: [ PaymentType ] },
          { model: Expense, include: [{ model: Tax }] }
        ]
      })
      if (!invoice) {
        throw new Error('Invoice not found')
      }
      return res.json(invoice)
    } catch (err: any) {
      console.warn(err)
      return err
    }
  },

  async store(req: Request, res: Response) {
    const data: _InvoiceInputCreate = req.body
    try {
      const invoice = new Invoice(data)
      await invoice.save()
      console.log('SAVED INVOICE', invoice)
      await saveAssociations(invoice, req.body)
      return res.status(201).json(invoice)
    } catch (err: any) {
      console.warn(err)
      return res.status(400).json({ ...err })
    }
  },

  async update(req: Request, res: Response) {
    const data: _InvoiceInputCreate = {
      ...req.body,
      UserId: req.body.UserId
    }
    try {
      const invoice: Invoice | null = await Invoice.findOne({
        where: {
          id: Number(data.id),
          UserId: Number(req.body.UserId)
        },
        include: [{ model: Tax }]
      })
      if (invoice) {
        invoice.set(data)
        await saveAssociations(invoice, data)
        return res.status(200).json(invoice)
      }
      return res.status(400).json({ message: 'Invoice not found' })
    } catch (err: any) {
      console.log(err)
      return res.status(400).json({ ...err })
    }
  },

  async destroy(req: Request, res: Response) {
    Invoice.destroy({
      where: {
        id: Number(req.params.InvoiceId),
        UserId: Number(req.body.UserId)
      }
    }).then((deleted) => {
      if (deleted)
        return res.sendStatus(204)
      return res.sendStatus(404)
    }).catch((err: Error) => {
      console.warn(err)
      return res.sendStatus(500)
    })
  },

  async loadLatestRefNo(req: Request, res: Response) {
    const invoice = await Invoice.findOne({
      where: {
        UserId: Number(req.body.UserId),
        refNo: { [Op.ne]: '' }
      },
      order: [ [ 'createdAt', 'DESC' ] ]
    })
    
    if (invoice?.refNo)
      return res.json({ refNo: invoice.refNo })
    return res.json({ refNo: 0 })
  }
}