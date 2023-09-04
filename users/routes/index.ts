import express, { NextFunction, Request, Response } from 'express'
import UserController from '../controllers/UserController'
import ProfileController from '../controllers/ProfileController'
import auth from '../../auth/middleware/auth'

const router = express.Router()

// Users
router.get('/', auth, (req: Request, res: Response) => UserController.index(req, res))
router.get('/:userId', auth, (req: Request, res: Response) => UserController.show(req, res))
router.post('/', auth, (req: Request, res: Response) => UserController.store(req, res))
router.put('/:userId', auth, async(req: Request, res: Response) => UserController.update(req, res))
router.delete('/:userId', auth, async(req: Request, res: Response) => UserController.destroy(req, res))

// Profile
router.put('/:userId/profile', auth, async(req: Request, res: Response) => {
  ProfileController.update(req, res)
})

export default router