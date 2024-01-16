import express, { NextFunction, Request, Response } from 'express'
import TaxController from '../controllers/TaxController'
import auth from '../middleware/auth'

const router = express.Router()

router.get('/:taxId', auth, (req: Request, res: Response) => TaxController.show(req, res))
router.get('/', auth, (req: Request, res: Response) => TaxController.index(req, res))
router.post('/', auth, (req: Request, res: Response) => TaxController.store(req, res))
router.put('/:taxId', auth, (req: Request, res: Response) => TaxController.update(req, res))
router.delete('/:taxId', auth, (req: Request, res: Response) => TaxController.destroy(req, res))

export default router