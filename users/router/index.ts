import express, { NextFunction, Request, Response } from 'express'
import UserController from '../controllers/UserController'

const router = express.Router()

// Users
router.get('/', (req: Request, res: Response) => UserController.index(req, res))
router.get('/:userId', (req: Request, res: Response) => UserController.show(req, res))
router.post('/', (req: Request, res: Response) => UserController.create(req, res))
router.patch('/:userId', async(req: Request, res: Response) => UserController.update(req, res))
router.delete('/:userId', async(req: Request, res: Response) => UserController.destroy(req, res))

export default router