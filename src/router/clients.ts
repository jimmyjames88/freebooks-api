import express, { Request, Response } from 'express'
import ClientController from '../controllers/ClientController'
import auth from '../middleware/auth'

const router = express.Router()

// Users
router.get('/', auth, (req: Request, res: Response) => ClientController.index(req, res))
router.get('/list', auth, (req: Request, res: Response) => ClientController.list(req, res))
router.get('/:ClientId', auth, (req: Request, res: Response) => ClientController.show(req, res))
router.get('/:ClientId/edit', auth, (req: Request, res: Response) => ClientController.edit(req, res))
router.post('/', auth, (req: Request, res: Response) => ClientController.store(req, res))
router.put('/:ClientId', auth, (req: Request, res: Response) => ClientController.update(req, res))
router.delete('/:ClientId', auth, (req: Request, res: Response) => ClientController.destroy(req, res))


export default router