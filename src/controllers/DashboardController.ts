import { Request, Response } from 'express'
import { Op } from 'sequelize'
import Invoice from '@models/Invoice'

export default {
  async outstandingRevenue(req: Request, res: Response) {
    const revenue = await Invoice.sum('total', {
      where: {
        userId: Number(req.body.userId),
        status: { [Op.notIn]: ['paid', 'void'] }
      }
    })
    const overdue = await Invoice.sum('total', {
      where: {
        userId: Number(req.body.userId),
        status: { [Op.notIn]: ['paid', 'void'] },
        dueDate: { [Op.lt]: new Date() }
      }
    })
    return res.json({
      revenue,
      overdue
    })
  }
}