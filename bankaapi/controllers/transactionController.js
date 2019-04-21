import { accounts, transactions } from '../db/db';
import UserHelper from '../helpers/userHelper';
import TransactionHelper from '../helpers/transactionHelper';
import Transaction from '../models/transaction';

export default class TransactionController {
  // creates a credit or debit transaction
  static newTransaction(req, res) {
    try {
      const { accountNumber, type } = req.body;
      let { amount } = req.body;
      const newTransactionId = transactions[transactions.length - 1].transactionId + 1;
      const thisTransaction = new Transaction(newTransactionId, accountNumber, amount, type);

      // check if account exists
      let accountFound = null;
      accounts.map((account) => {
        if (String(account.accountNumber) === String(accountNumber)) {
          accountFound = account;
        }
      });
      if (!accountFound) {
        return res.status(404).json({
          status: 404,
          success: 'false',
          error: 'Account not found',
        });
      }
      if (type === 'debit') {
        if (amount && accountFound.balance > amount) {
          amount = (-1 * parseInt(amount, 10));
        } else {
          return res.status(400).json({
            status: 400,
            success: 'false',
            error: 'Insufficient balance',
          });
        }
      }
      if (type === 'credit') {
        if (!amount || parseInt(req.body.amount, 10) <= 0) {
          return res.status(400).json({
            status: 400,
            success: 'false',
            error: 'Provide amount greater than 0',
          });
        }
      }
      thisTransaction.oldBalance = accountFound.balance;
      accountFound.balance += amount;
      thisTransaction.newBalance = accountFound.balance;
      transactions.push(thisTransaction);

      return res.status(200).json({
        status: 200,
        success: 'true',
        message: `Account is ${type}ed with ${type === 'debit'? amount = (-1 * amount) : amount} Naira`,
        TransactionFound: thisTransaction,
      });
    } catch (error) {
      // res.status(500).json({
      //   status: 200,
      //   success: 'false',
      //   error: 'Something went wrong. Try again.',
      // });
    }
  }

  // get all transactions
  static getAllTransactions(req, res) {
    try {
      let transactionsFound = [];
      if (req.query.accountNumber || req.body.accountNumber || req.query.email || req.body.email || req.query.userId || req.body.userId){
        if (req.query.accountNumber || req.body.accountNumber) {
          //const transactionId = req.query.transactionId || req.body.transactionId;
          const accountNumber = req.query.accountNumber || req.body.accountNumber;
          //const userId = req.query.userId || req.body.userId;
          // const userFound = UserHelper.findUserByAccountNumber(parseInt(accountNumber, 10))
          //                 || UserHelper.findUserByTransactionId(parseInt(transactionId, 10)) 
          //                 || UserHelper.findUserById(parseInt(userId, 10));

          transactionsFound = TransactionHelper.findTransactionByAccountNumber(parseInt(accountNumber, 10));

          // if (!transactionFound) {
          //   if (req.data.type !== 'user') {
          //     transactions.map((transaction) => {
          //       transactionsFound.push(transaction);
          //     });
          //   } else {
          //     return res.status(403).json({
          //       status: 403,
          //       success: 'false',
          //       error: 'Unathorized',
          //     });
          //   }
          // } else if (req.data.type !== 'admin' || req.data.type !== 'cashier') {
          //   if (req.data.userId !== userFound.userId) {
          //     return res.status(403).json({
          //       status: 403,
          //       success: 'false',
          //       error: 'Unathorized',
          //     });
          //   }
        }
        if ((req.query.email || req.body.email ) && (!req.query.accountNumber && !req.body.accountNumber)) {
          const email = req.query.email || req.body.email;
          const userFound = UserHelper.findUserByEmail(email);
          // if (!userFound) {
          //   transactionsFound = [];
          // }
          //else {
            transactionsFound = TransactionHelper.findTransactionByUserId(parseInt(userFound.userId, 10));
         // }        
        }
        if ((req.query.userId || req.body.userId ) && (!req.query.accountNumber && !req.body.accountNumber) && (!req.query.email && !req.body.email)) {
          const userId = req.query.userId || req.body.userId;
          //const userFound = UserHelper.findUserById(parseInt(userId), 10);
          //const accountNumber = userFound.accountNumber;
          transactionsFound = TransactionHelper.findTransactionByUserId(parseInt(userId, 10));
        }
      }
      else {
        transactions.map((transaction) => {
          transactionsFound.push(transaction);
        });
      }
      
      if (transactionsFound.length === 1) {
        return res.status(200).json({
          status: 200,
          success: 'true',
          message: 'Transaction retrieved successfully',
          TransactionFound: transactionsFound,
        });
      }
      if (transactionsFound.length > 1) {
        return res.status(200).json({
          status: 200,
          success: 'true',
          message: 'Transactions retrieved successfully',
          TransactionFound: transactionsFound,
        });
      }

      return res.status(404).json({
        status: 404,
        success: 'false',
        error: 'No transaction found',
      });
    } catch (error) {
      // return res.status(500).json({
      //   status: 505,
      //   success: 'false',
      //   error: 'Something went wrong',
      // });
    }
  }

  // get a specific transaction
  static getTransaction(req, res) {
    try {
      const { transactionId } = req.params;
      const transactionFound = TransactionHelper.findTransactionById(parseInt(transactionId), 10);
      if (transactionFound && transactionFound.length > 0) {
        return res.status(200).json({
          status: 200,
          success: 'true',
          message: 'Transaction retrieved successfully',
          TransactionFound: transactionFound,
        });
      }

      return res.status(404).json({
        status: 404,
        success: 'false',
        error: 'No transaction found',
      });
    } catch (error) {
      // return res.status(500).json({
      //   status: 500,
      //   success: 'false',
      //   error: 'Something went wrong',
      // });
    }
  }
}
