import express, { Request, Response } from 'express'
import ExpenseController from '../controllers/ExpenseController'
import auth from '../middleware/auth'

const router = express.Router()

router.get('/', auth, (req: Request, res: Response) => ExpenseController.index(req, res))
router.post('/', auth, (req: Request, res: Response) => ExpenseController.store(req, res))

export default router