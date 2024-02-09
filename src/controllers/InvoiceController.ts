import { Request, Response } from 'express'
import { Op, FindOptions } from 'sequelize'
import { _Expense, _Invoice, _InvoiceStatus, _LineItem, _Payment, _Tax } from '@jimmyjames88/freebooks-types'
import Invoice, { _InvoiceInput, _InvoiceOutput } from '@models/Invoice'
import Client from '@models/Client'
import User from '@models/User'
import Profile from '@models/Profile'
import Tax from '@models/Tax'
import Payment from '@models/Payment'
import Expense from '@models/Expense'
import PaymentType from '@models/PaymentType'


// todo centralize
export interface TypedRequest<T> extends Request {
  body: T
}

export interface TypedResponse<T> extends Response {
  body: T
}

const saveExpenses = async (invoice: Invoice, expenses: _Expense[]) => {
  // create new expenses and update existing ones
  if (expenses) {
    for (let expense of expenses) {
      if (expense.id) {
        const existingExpense = await Expense.findByPk(expense.id)
        if (existingExpense) {
          existingExpense.set(expense)
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
  // create new payments and update existing ones
  if (payments) {
    for (let payment of payments) {
      if (payment.id) {
        const existingPayment = await Payment.findByPk(payment.id)
        if (existingPayment) {
          // set and save
          existingPayment.set(payment)
          await existingPayment.save()
        }
      } else {
        await invoice.createPayment({ UserId: invoice.UserId , ...payment })
      }
    }
  }
}

const saveAssociations = async (invoice: Invoice, data: _InvoiceInput ) => {
  invoice.setTaxes(data.Taxes?.map((tax: _Tax) => tax.id))
  invoice.setClient(data.Client?.id)
  
  if (data.Payments) savePayments(invoice, data.Payments)
  if (data.Expenses) saveExpenses(invoice, data.Expenses)

  await invoice.save()
}

export default {
  async index(req: Request, res: Response) {
    const options: FindOptions = {
      attributes: { include: ['total'] },
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
      if (sortBy.key === 'client.name') {
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

  async show(req: Request, res: Response): Promise<Response<_InvoiceOutput>> {
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

  async store(req: TypedRequest<_InvoiceInput>, res: Response): Promise<Response<_InvoiceOutput>> {
    const invoice = await Invoice.create(req.body)
    await saveAssociations(invoice, req.body)
    return res.status(201).json(invoice)
  },

  async update(req: TypedRequest<_InvoiceInput>, res: Response): Promise<Response<_InvoiceOutput>> {
    const data: _InvoiceInput = {
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