import { accounts, transactions } from '../db/db';

import Transaction from '../models/transaction';

export default class TransactionController {
    //creates a credit or debit transaction
    static newTransaction(req, res) {
    try {
        const { accountNumber, type } = req.body;
        let { amount } = req.body;
        const newId = transactions[transactions.length - 1].id + 1;
        let this_transaction = new Transaction(newId, accountNumber, amount, type);
        
        //check if account exists
        let accountFound = '';
        accounts.map((account) => {
            if (account.accountNumber === accountNumber) {
                accountFound = account;
            }
        });
        if (!accountFound) {
            return res.status(404).json({
                success: 'false',
                message: 'Account not found'
            });
        }
        if (type === 'debit') {
            if (amount && accountFound.balance > amount) {
                amount = (-1 * amount);
            } 
            else {
                return res.status(422).json({
                    success: 'false',
                    error: 'Insufficient balance'
                });
            }
        }
        if (type === 'credit') {
            if (!amount || req.body.amount <= 0) {
                return res.status(404).json({
                    success: 'false',
                    error: 'Provide amount greater than 0'
                });
            }
        }
        this_transaction.oldBalance = accountFound.balance;
        accountFound.balance += amount;
        this_transaction.newBalance = accountFound.balance;
        transactions.push(this_transaction);
        
        return res.status(200).json({
            success: 'true',
            message: `Account is ${ type }'ed' with ${ amount } Naira`,
            TransactionFound: this_transaction
        });
    }
    catch (error) {
        res.status(500).json({
            success: 'false',
            error: 'Something went wrong. Try again.'
        });
    }
    } 
    //get all transactions
    static getAllTransactions(req, res) {
        try{
            if (req.body || req.params || req.query.id) {
                const id = parseInt(req.params.id) || req.query.id;
                const { accountNumber } = req.query;
                let transactionsFound = [];
                transactions.map((transaction) => {
                    if (transaction.id === id || transaction.accountNumber === accountNumber) {
                        transactionsFound.push(transaction);
                    }
                });
                if (transactionsFound.length = 1) {
                    return res.status(201).json({
                    success: 'true',
                    message: 'Transaction retrieved successfully',
                    TransactionFound: transactionsFound
                    });
                }
                if (transactionsFound.length > 1) {
                    return res.status(201).json({
                    success: 'true',
                    message: 'Transactions retrieved successfully',
                    TransactionFound: transactionsFound
                    });
                }
                else {
                    return res.status(404).json({
                        success: 'false',
                        message: 'No transaction found'
                    });
                }
            }
            else {
                if (transactions) {
                    return res.status(201).json({
                        success: 'true',
                        message: 'Transactions retrieved successfully',
                        TransactionFound: [...transactions]
                        });
                }
                return res.status(404).json({
                    success: 'false',
                    error: 'No transaction found',
                    }); 
            }     
        }
        catch (error) {
            return res.status(500).json({
            success: 'false',
            message: 'Something went wrong'
            });
        }
    }
    //get a specific transaction
    static getTransaction(req, res) {
        try{
            const id = parseInt(req.params.id) || parseInt(req.query.id);
            let transactionFound = 'false';
            transactions.map((transaction) => {
                if (transaction.id === id ) {
                    transactionFound = transaction;
                }
            });
            if (transactionFound) {
                return res.status(201).json({
                  success: 'true',
                  message: 'Transaction retrieved successfully',
                  TransactionFound: transactionFound
                });
              }
            else {
                return res.status(404).json({
                    success: 'false',
                    message: 'Not found',
                    TransactionFound: transactionFound
                    });
            }
        }
        catch (error) {
            return res.status(500).json({
                success: 'false',
                message: 'Something went wrong'
                });
        }
    }
}
