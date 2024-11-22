import express, { Request, Response } from 'express'
import InvoiceController from '../controllers/InvoiceController'
import auth from '../middleware/auth'

const router = express.Router()

// Users
router.get('/', auth, (req: Request, res: Response) => InvoiceController.index(req, res))
router.get('/latest-ref-no', auth, (req: Request, res: Response) => InvoiceController.loadLatestRefNo(req, res))
router.get('/:InvoiceId', auth, (req: Request, res: Response) => InvoiceController.show(req, res))
router.post('/', auth, (req: Request, res: Response) => InvoiceController.store(req, res))
router.put('/:InvoiceId', auth, (req: Request, res: Response) => InvoiceController.update(req, res))
router.put('/:InvoiceId/status', auth, (req: Request, res: Response) => InvoiceController.updateStatus(req, res))
router.delete('/:InvoiceId', auth, (req: Request, res: Response) => InvoiceController.destroy(req, res))

export default router