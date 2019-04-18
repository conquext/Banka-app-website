import { accounts, transactions } from '../db/db';

import Transaction from '../models/transaction';

export default class TransactionController {
  // creates a credit or debit transaction
  static newTransaction(req, res) {
    try {
      const { accountNumber, type } = req.body;
      let { amount } = req.body;
      const newId = transactions[transactions.length - 1].transactionId + 1;
      const this_transaction = new Transaction(newId, accountNumber, amount, type);

      // check if account exists
      let accountFound = '';
      accounts.map((account) => {
        if (account.accountNumber === accountNumber) {
          accountFound = account;
        }
      });
      if (!accountFound) {
        return res.status(404).json({
          success: 'false',
          message: 'Account not found',
        });
      }
      if (type === 'debit') {
        if (amount && accountFound.balance > amount) {
          amount = (-1 * amount);
        } else {
          return res.status(422).json({
            success: 'false',
            error: 'Insufficient balance',
          });
        }
      }
      if (type === 'credit') {
        if (!amount || req.body.amount <= 0) {
          return res.status(404).json({
            success: 'false',
            error: 'Provide amount greater than 0',
          });
        }
      }
      this_transaction.oldBalance = accountFound.balance;
      accountFound.balance += amount;
      this_transaction.newBalance = accountFound.balance;
      transactions.push(this_transaction);

      return res.status(200).json({
        success: 'true',
        message: `Account is ${type}'ed' with ${amount} Naira`,
        TransactionFound: this_transaction,
      });
    } catch (error) {
      res.status(500).json({
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
        let transactionsFound = [];

        
        if (!transactionId) {
          if (accountNumber) {
            transactions.map((transaction) => {
            if (String(transaction.accountNumber) === String(accountNumber)) {
              transactionsFound.push(transaction);
            }
            });
          }
        }
        if (!accountNumber) {
            if (transactionId) {
              transactions.map((transaction) => {
              if (transaction.transactionId === transactionId) {
                transactionsFound.push(transaction);
              }
              });
            }
        }
        if (!transactionId){
          if(!accountNumber){
            transactions.forEach((transaction) => {
              transactionsFound.push(transaction);
            });
          }
        }
        if (transactionsFound.length === 1) {
          return res.status(201).json({
            success: 'true',
            message: 'Transaction retrieved successfully',
            TransactionFound: transactionsFound,
          });
        }
        if (transactionsFound.length > 1) {
          return res.status(201).json({
            success: 'true',
            message: 'Transactions retrieved successfully',
            TransactionFound: transactionsFound,
          });
        }

        return res.status(404).json({
          success: 'false',
          message: 'No transaction found',
        });
      }

      if (transactions) {
        return res.status(201).json({
          success: 'true',
          message: 'Transactions retrieved successfully',
          TransactionFound: [...transactions],
        });
      }
      return res.status(404).json({
        success: 'false',
        error: 'No transaction found',
      });
    } catch (error) {
      return res.status(500).json({
        success: 'false',
        message: 'Something went wrong',
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
        return res.status(201).json({
          success: 'true',
          message: 'Transaction retrieved successfully',
          TransactionFound: transactionFound,
        });
      }

      return res.status(404).json({
        success: 'false',
        message: 'Not found',
        TransactionFound: transactionFound,
      });
    } catch (error) {
      return res.status(500).json({
        success: 'false',
        message: 'Something went wrong',
      });
    }
  }
}
