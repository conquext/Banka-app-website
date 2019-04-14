import { Router } from 'express';
import userController from '../controllers/userController';
import validate from '../middlewares/validate';

const router = Router();

const { login, signup } = userController;

router.post('/auth/login', validate.loginCheck, login);
router.post('/auth/signup', validate.signupCheck, signup);

export default router;