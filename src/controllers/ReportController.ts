import { Request, Response } from 'express'
// import Invoice from '@models/Invoice'

export default {
  async totals(req: Request, res: Response) {
    // const invoices = await Invoice.findAll({
    //   where: { UserId: 1 }
    // })
    // if (invoices) {
    //   const totals = invoices.reduce((acc, invoice) => {
    //     acc.subtotal += Number(invoice.subtotal)
    //     acc.tax += Number(invoice.tax)
    //     acc.total += Number(invoice.total)
    //     return acc
    //   }, {
    //     subtotal: 0,
    //     tax: 0,
    //     total: 0
    //   })
    //   return res.json(totals)
    // }
    return res.status(401).json({})
  }
}