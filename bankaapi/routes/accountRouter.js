import { Router } from 'express';
import { authorize } from '../middlewares/';
import { accountController } from '../controllers/accountController';

const router = Router();

const { createAccount, getAllAccounts, getAccount, updateAccount, deleteAccount } = accountController;
const { authUser, authCashier, authAdmin, authStaff } = authorize;

router.post('/accounts', authUser, validate.accountCheck, createAccount);
router.get('/accounts', authStaff, getAllAccounts);
router.get('/accounts/:id', authStaff, getAccount);
router.patch('/accounts/:id', authAdmin, updateAccount);
router.delete('/accounts/:id', authAdmin, deleteAccount);

export default router;