import { Router } from 'express';
import { authorize } from '../middlewares/';
import { userController } from '../controllers/userController';

const router = Router();

const { getAllUsers, getUser, updateUser, deleteUser } = userController;
const { authAdmin, authStaff } = authorize;

router.get('/users', authStaff, getAllUsers);
router.get('/users/:id', authStaff, getUser);
router.put('/users', updateUser);
router.patch('/users/:id', authAdmin, promoteUser);
router.delete('/users/:id', authAdmin, deleteUser);


export default router;