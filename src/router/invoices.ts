import express, { Request, Response } from 'express'
import InvoiceController from '../controllers/InvoiceController'
import auth from '../middleware/auth'

const router = express.Router()

// Users
router.get('/', auth, (req: Request, res: Response) => InvoiceController.index(req, res))
router.get('/:invoiceId', auth, (req: Request, res: Response) => InvoiceController.show(req, res))
router.post('/', auth, (req: Request, res: Response) => InvoiceController.store(req, res))


export default router