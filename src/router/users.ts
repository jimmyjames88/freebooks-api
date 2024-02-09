import express, { NextFunction, Request, Response } from 'express'
import UserController from '../controllers/UserController'
import auth from '../middleware/auth'

const router = express.Router()

// Users
router.get('/:UserId', auth, (req: Request, res: Response) => UserController.show(req, res))
router.put('/:UserId', auth, async(req: Request, res: Response) => UserController.update(req, res))
router.delete('/:UserId', auth, async(req: Request, res: Response) => UserController.destroy(req, res))

export default router