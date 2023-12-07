import express, { Request, Response } from 'express'
import auth from '@middleware/auth'
import ReportController from '@controllers/ReportController'

const router = express.Router()

router.post('/temp/totals', auth, async(req: Request, res: Response) => ReportController.totals(req, res))

export default router