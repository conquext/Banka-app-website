import { Router } from 'express';
import authorize from '../middlewares/authorize';
import validate from '../middlewares/validate';
import transactionController from '../controllers/transactionController';

const router = Router();

const { newTransaction, getAllTransactions, getTransaction } = transactionController;
const { authCashier, authStaff, authSpecial } = authorize;

router.post('/transactions', authCashier, validate.transactionCheck, newTransaction);
router.get('/transactions', authStaff, getAllTransactions);
router.get('/transactions/:id', authSpecial, getTransaction);

export default router;