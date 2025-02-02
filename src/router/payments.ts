import express, { NextFunction, Request, Response } from 'express'
import PaymentController from '../controllers/PaymentController'
import auth from '../middleware/auth'

const router = express.Router()

// router.get('/:paymentId', auth, (req: Request, res: Response) => PaymentController.show(req, res))
router.get('/', auth, (req: Request, res: Response) => PaymentController.index(req, res))
router.post('/', auth, (req: Request, res: Response) => PaymentController.store(req, res))
router.put('/:PaymentId', auth, (req: Request, res: Response) => PaymentController.update(req, res))
router.delete('/:PaymentId', auth, (req: Request, res: Response) => PaymentController.destroy(req, res))
router.get('/types', auth, (req: Request, res: Response) => PaymentController.types(req, res))

export default router