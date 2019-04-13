import db from '../db';
import { Account } from '../models/account';
import { Transaction } from '../models/transaction';


const { accounts, transactions } = db;

class transactionController {
    //creates a credit or debit transaction
    static newTransaction(req, res) {
    try {
        const { accountNumber, amount, type } = req.body;
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
        
        return res.status(201).json({
            success: 'true',
            message: `Account is { type + 'ed' } with { amount } Naira`,
            Account: accountFound
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
            if (transactions) {
                return res.status(201).json({
                    success: 'true',
                    message: 'Transactions retrieved successfully',
                    Transactions: [...transactions]
                    });
            }
            return res.status(404).json({
                success: 'fail',
                error: 'No transaction found',
                });      
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
            const id = parseInt(req.params.id);
            let result = '';
            for(var i = 0; i < transactions.length; i++){
                if (id === transactions[i].id) {
                    result = transaction[i];
                    return res.status(201).json({
                        success: 'true',
                        message: 'Transactions retrieved successfully ',
                        Account: result
                        });
                }
                else {
                    return res.status(404).json({
                        success: 'fail',
                        message: 'Not found',
                        Account: result
                        });
                }
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