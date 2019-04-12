import { Router } from 'express';
import { authorize, validate } from '../middlewares/';
import { transactionController } from '../controllers/transactionController';

const router = Router();

const { newTransaction, getAllTransactions, getTransaction } = transactionController;
const { authCashier, authStaff } = authorize;

router.post('/transactions', authCashier, validate.transactionCheck, newTransaction);
router.get('/transactions', authStaff, getAllTransactions);
router.get('/transactions/:id', authStaff, getTransaction);

export default router;