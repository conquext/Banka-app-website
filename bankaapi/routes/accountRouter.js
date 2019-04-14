import { Router } from 'express';
import authorize from '../middlewares/authorize';
import accountController from '../controllers/accountController';

const router = Router();

const { createAccount, getAllAccounts, getAccount, updateAccount, deleteAccount } = accountController;
const { authUser, authSpecial, authAdmin, authStaff } = authorize;

router.post('/accounts', authUser, validate.accountCheck, createAccount);
router.get('/accounts', authStaff, getAllAccounts);
router.get('/accounts/:id', authSpecial, getAccount);
router.patch('/accounts/:id', authAdmin, updateAccount);
router.delete('/accounts/:id', authAdmin, deleteAccount);

export default router;