import { Router } from 'express';
import accountController from '../controllers/accountController';
import authorizeMiddleware from '../middlewares/permissionsMiddleware';
import validateMiddleware from '../middlewares/validateMiddleware';

const router = Router();

const {
  createAccount, getAllAccounts, getAccount, updateAccount, deleteAccount,
} = accountController;
const {
  authUser, authAdminOrIsUser, authAdmin, authStaff,
} = authorizeMiddleware;
const { accountCheck } = validateMiddleware;

router.post('', authUser, accountCheck, createAccount);
router.get('', authStaff, getAllAccounts);
router.get('/:id', authAdminOrIsUser, getAccount);
router.patch('/:id', authAdmin, updateAccount);
router.delete('/:id', authAdmin, deleteAccount);

export default router;
