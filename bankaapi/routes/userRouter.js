import { Router } from 'express';
import authMiddleware from '../middlewares/authMiddleware';
import permissionsMiddleware from '../middlewares/permissionsMiddleware';
import userController from '../controllers/userController';
import validateMiddleware from '../middlewares/validateMiddleware';

const router = Router();

const {
  getAllUsers, getUser, updateUser, deleteUser, promoteUser,
} = userController;
const { authAdmin, authStaff, authAdminOrItsUser } = permissionsMiddleware;
const { authenticateUser } = authMiddleware;
const { validateUserUpdate } = validateMiddleware;

router.use(authenticateUser);
router.get('/', authStaff, getAllUsers);
router.get('/:id', authAdminOrItsUser, getUser);
router.put('/:id', validateUserUpdate, authAdminOrItsUser, updateUser);
router.patch('/:id', authAdmin, promoteUser);
router.delete('/:id', authAdmin, deleteUser);


export default router;
