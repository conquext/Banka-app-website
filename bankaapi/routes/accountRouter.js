import PermissionsMiddleware from '../middlewares/permissionsMiddleware';
import { Router } from 'express';
import accountController from '../controllers/accountController';
import authMiddleware from '../middlewares/authMiddleware';
import permissionsMiddleware from '../middlewares/permissionsMiddleware';
import validateMiddleware from '../middlewares/validateMiddleware';

const router = Router();

const { createAccount, getAllAccounts, getAccount, updateAccount, deleteAccount } = accountController;
const { authUser, authAdminOrItsUser, authAdmin, authStaff } = PermissionsMiddleware;
const { accountCheck } = validateMiddleware;
const { authenticateUser } = authMiddleware;

router.use(authenticateUser);
router.post('', authUser, accountCheck, createAccount);
router.get('', authStaff, getAllAccounts);
router.get('/:id', authAdminOrItsUser, getAccount);
router.patch('/:id', authAdmin, updateAccount);
router.delete('/:id', authAdmin, deleteAccount);

export default router;
