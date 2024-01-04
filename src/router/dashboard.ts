import express, { Request, Response } from 'express'
import DashboardController from '../controllers/DashboardController'
import auth from '../middleware/auth'

const router = express.Router()

router.get('/outstanding-revenue', auth, (req: Request, res: Response) => DashboardController.outstandingRevenue(req, res))

export default router