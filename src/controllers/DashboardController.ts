import { Request, Response } from 'express'
import { _InvoiceStatus } from '@jimmyjames88/freebooks-types'

export default {
  async outstandingRevenue(req: Request, res: Response) {
    // const revenue = await Invoice.sum('total', {
    //   where: {
    //     UserId: Number(req.body.UserId),
    //     status: { [Op.notIn]: [_InvoiceStatus.PAID, _InvoiceStatus.VOID] }
    //   }
    // })
    // const pastDue = await Invoice.sum('total', {
    //   // todo - doesn't adequately handle partial payments, fix this
    //   where: {
    //     UserId: Number(req.body.UserId),
    //     status: { [Op.notIn]: [_InvoiceStatus.PAID, _InvoiceStatus.VOID] },
    //     dueDate: { [Op.lt]: new Date() }
    //   }
    // })
    // return res.json({
    //   revenue,
    //   pastDue
    // })
  }
}