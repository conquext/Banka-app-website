import { Router } from 'express';
import authMiddleware from '../middlewares/authMiddleware';
import authorizeMiddleware from '../middlewares/permissionsMiddleware';
import transactionController from '../controllers/transactionController';
import validateMiddleware from '../middlewares/validateMiddleware';

const router = Router();

const { newTransaction, getAllTransactions, getTransaction } = transactionController;
const { authCashier, authStaff, authAdminOrIsUser } = authorizeMiddleware;
const { authenticateUser } = authMiddleware;

router.use(authenticateUser);
router.post('/transactions', authCashier, validateMiddleware.transactionCheck, newTransaction);
router.get('/transactions', authStaff, getAllTransactions);
router.get('/transactions/:id', authAdminOrIsUser, getTransaction);

export default router;
