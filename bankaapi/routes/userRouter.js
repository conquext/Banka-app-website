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
router.get('/:userId', authAdminOrItsUser, getUser);
router.put('/:userId', validateUserUpdate, authAdminOrItsUser, updateUser);
router.patch('/:userId', authAdmin, promoteUser);
router.delete('/:userId', authAdmin, deleteUser);


export default router;
