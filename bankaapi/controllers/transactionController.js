import { accounts, transactions } from '../db/db';
import UserHelper from '../helpers/userHelper';

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
          return res.status(404).json({
            status: 404,
            success: 'false',
            error: 'Insufficient balance',
          });
        }
      }
      if (type === 'credit') {
        if (!amount || parseInt(req.body.amount, 10) <= 0) {
          return res.status(404).json({
            status: 404,
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
        message: `Account is ${type}ed with ${amount} Naira`,
        TransactionFound: thisTransaction,
      });
    } catch (error) {
      res.status(500).json({
        status: 200,
        success: 'false',
        error: 'Something went wrong. Try again.',
      });
    }
  }

  // get all transactions
  static getAllTransactions(req, res) {
    try {
      if (req.body.transactionId || req.query.transactionId || req.query.accountNumber || req.body.accountNumber) {
        const transactionId = req.query.transactionId || req.body.transactionId;
        const accountNumber  = req.query.accountNumber || req.body.accountNumber;
        let userFound = UserHelper.findUserByAccountNumber(parseInt(accountNumber, 10)) 
                        || UserHelper.findUserByTransactionId(parseInt(transactionId, 10));
        
        let transactionsFound = [];

        if (!userFound) {
          if (req.data.type !== 'user') {
            transactions.map((transaction) => {
                transactionsFound.push(transaction);
            });
          }
          else {
            return res.status(403).json({
              status: 403,
              success: "false",
              error: "Unathorized"
            });
          }
        }
        else { 
          if (req.data.userId !== userFound.userId) {
            if (req.data.type !== 'admin' || req.data.type !== 'cashier') {
              return res.status(403).json({
                status: 403,
                success: "false",
                error: "Unathorized"
              });
            }
            else {
              transactions.map((transaction) => {
              if (String(transaction.accountNumber) === String(userFound.accountNumber)) {
                transactionsFound.push(transaction);
                }
              });
            }
          }
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
      }

      if (transactions) {
        return res.status(200).json({
          status: 200,
          success: 'true',
          message: 'Transactions retrieved successfully',
          TransactionFound: [...transactions],
        });
      }
      return res.status(404).json({
        status: 404,
        success: 'false',
        error: 'No transaction found',
      });
    } catch (error) {
      return res.status(500).json({
        status: 505,
        success: 'false',
        error: 'Something went wrong',
      });
    }
  }

  // get a specific transaction
  static getTransaction(req, res) {
    try {
      const { transactionId } = req.params;
      let transactionFound = null;
      transactions.map((transaction) => {
        if (transaction.transactionId === parseInt(transactionId, 10)) {
          transactionFound = transaction;
        }
      });
      if (transactionFound) {
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
        error: 'Not found',
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        success: 'false',
        error: 'Something went wrong',
      });
    }
  }
}
