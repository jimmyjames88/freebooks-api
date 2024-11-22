import express, { Request, Response } from 'express'
import ExpenseController from '../controllers/ExpenseController'
import auth from '../middleware/auth'

const router = express.Router()

router.get('/', auth, (req: Request, res: Response) => ExpenseController.index(req, res))
router.get('/:id', auth, (req: Request, res: Response) => ExpenseController.show(req, res))
router.put('/:id', auth, (req: Request, res: Response) => ExpenseController.update(req, res))
router.post('/', auth, (req: Request, res: Response) => ExpenseController.store(req, res))
router.delete('/:id', auth, (req: Request, res: Response) => ExpenseController.destroy(req, res))

export default router