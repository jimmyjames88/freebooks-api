import express, { Request, Response } from 'express'
import AuthController from '../controllers/AuthController'

const router = express.Router()

router.post('/login', async(req: Request, res: Response) => AuthController.login(req, res))
router.post('/register', async(req: Request, res: Response) => AuthController.register(req, res))

export default router