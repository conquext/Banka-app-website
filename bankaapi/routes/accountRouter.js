import { Router } from 'express';
import accountController from '../controllers/accountController';
import authMiddleware from '../middlewares/authMiddleware';
import permissionsMiddleware from '../middlewares/permissionsMiddleware';
import validateMiddleware from '../middlewares/validateMiddleware';

const router = Router();

const { createAccount, getAllAccounts, getAccount, updateAccount, deleteAccount } = accountController;
const { authUser, authStaff, authAdminOrItsUser, authAdminOrItsAccountOwner, authAdmin, authStaffOrItsAccountOwner } = permissionsMiddleware;
const { accountCreateCheck, accountUpdateCheck } = validateMiddleware;
const { authenticateUser } = authMiddleware;

router.use(authenticateUser);
router.post('', authUser, accountCreateCheck, createAccount);
router.get('', authStaffOrItsAccountOwner, getAllAccounts);
router.get('/:accountId', authStaff, getAccount);
router.patch('/:accountId', authAdmin, accountUpdateCheck, updateAccount);
router.delete('/:accountId', authAdmin, deleteAccount);

export default router;
