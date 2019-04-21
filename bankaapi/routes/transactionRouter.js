import { Router } from 'express';
import authMiddleware from '../middlewares/authMiddleware';
import authorizeMiddleware from '../middlewares/permissionsMiddleware';
import transactionController from '../controllers/transactionController';
import validateMiddleware from '../middlewares/validateMiddleware';

const router = Router();

const { newTransaction, getAllTransactions, getTransaction } = transactionController;
const {
  authCashier, authStaff, authStaffOrItsAccountOwner,
} = authorizeMiddleware;
const { authenticateUser } = authMiddleware;
const { transactionCheck } = validateMiddleware;

router.use(authenticateUser);
router.post('', authCashier, transactionCheck, newTransaction);
router.get('', authStaffOrItsAccountOwner, getAllTransactions);
router.get('/:transactionId', authStaff, getTransaction);

export default router;
