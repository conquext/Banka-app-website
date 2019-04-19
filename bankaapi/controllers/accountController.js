import { accounts, users } from '../db/db';
import UserHelper from '../helpers/userHelper';
import Account from '../models/account';

export default class AccountController {
  // creates an account
  static createAccount(req, res) {
    try {
      const newId = accounts[accounts.length - 1].accountId + 1;
      const newAccountNumber = accounts[accounts.length - 1].accountNumber + 1;
      const { type, bank } = req.body;
      
      const userFound = UserHelper.findUserById(parseInt(req.data.userId, 10));
      if (userFound) {
        const newAccount = new Account(
          {
            accountId: newId, accountNumber: newAccountNumber, type: type, userId: userFound.userId, balance: 0
          });
        accounts.push(newAccount);

        return res.status(201).json({
          status: 201,
          success: 'true',
          message: 'Account is created successfully',
          data: newAccount,
        });
      }
      else{
        return res.status(403).json({
          status: 403,
          success: 'false',
          error: 'Unauthorized',
        });
      }
    } catch (error) {
        res.status(500).json({
          status: 500,
          success: 'false',
          error: 'Something went wrong. Try again.',
        });
    }
  }

  // get all accounts
  static getAllAccounts(req, res) {
    try {
      const accountsFound = [];
      if (req.query.userId || req.query.email  || req.query.accountNumber) {
        const { userId, email, accountNumber } = req.query;
        const user = UserHelper.findUserById(parseInt(userId, 10)) || UserHelper.findUserByEmail(email) || UserHelper.findUserByAccountNumber(accountNumber);
        //accepts other query search for accounts
        //find all accounts of a user
        if(user){
          accounts.map((account) => {
            if(account.userId === user.userId){
              accountsFound.push(account);
            }
          });
        }
      }
      else {
        if (accounts) {
            accounts.map((account) => {
            accountsFound.push(account);
          });
        }        
      }
      if (accountsFound.length === 1) {
        return res.status(200).json({
          status: 200,
          success: 'true',
          message: 'Account retrieved successfully',
          Account: accountsFound,
        });
      }
      if (accountsFound.length > 1) {
        return res.status(200).json({
          status: 200,
          success: 'true',
          message: 'Accounts retrieved successfully',
          Account: accountsFound,
        });
      }
      else{
        return res.status(404).json({
          status: 404,
          success: 'false',
          error: 'Account not found',
        });
      }
      
    } catch (error) {
        return res.status(500).json({
          status: 500,
          success: 'false',
          error: 'Something went wrong',
        });
    }
  }

  // get a specific account
  static getAccount(req, res) {
    try {
      const thisAccountId = parseInt(req.params.accountId, 10);
      let accountFound = 'false';
      accounts.map((account) => {
        if (account.accountId === thisAccountId ) {
          accountFound = account;
        }
      });
      if (accountFound && accountFound.status === "active") {
        return res.status(200).json({
          status: 200,
          success: 'true',
          message: 'Accounts retrieved successfully',
          Account: accountFound,
        });
      }

      return res.status(404).json({
        status: 404,
        success: 'false',
        error: 'Account not found',
        Account: accountFound,
      });
    } catch (error) {
        return res.status(500).json({
          status: 500,
          success: 'false',
          error: 'Something went wrong',
        });
    }
  }

  // update specific account
  static updateAccount(req, res) {
    try {
      const accountId = parseInt(req.params.accountId, 10);
      const { accountNumber } = req.query;
      let accountFound = null;
      accounts.map((account) => {
        if (account.accountId === accountId) {
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

      if(accountFound.status === req.body.status){
        return res.status(400).json({
          status: 400,
          success: 'false',
          error: `Account is already ${req.body.status}d`,
        });
      }
      accountFound.status = req.body.status || req.params.status || req.query.status;
      return res.status(200).json({
        status: 200,
        success: 'true',
        message: `Account ${req.body.status}d successfully`,
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        success: 'false',
        error: 'Something went wrong',
      });
    }
  }

  // delete specific account
  static deleteAccount(req, res) {
    try {
      const accountId = parseInt(req.params.accountId, 10);
      const { accountNumber } = req.body || req.params || req.query || '';
      let accountFound = null;
      let accountIndex = '';
      accounts.map((account, index) => {
        if (account.accountId === accountId) {
          accountFound = account;
          accountIndex = index;
        }
      });
      if (!accountFound) {
        return res.status(404).json({
          status: 404,
          success: 'false',
          error: 'Account not found',
        });
      }
      accountFound.deleted = "true";
      accounts.splice(accountIndex, 1);
      return res.status(200).json({
        status: 200,
        success: 'true',
        message: 'Account deleted successfully',
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
