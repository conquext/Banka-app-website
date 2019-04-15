import { accounts, users } from '../db/db';

import Account from '../models/account';

export default class AccountController {
  // creates an account
  static createAccount(req, res) {
    try {
      const newId = accounts[accounts.length - 1].id + 1;
      const newAccountNumber = accounts[accounts.length - 1].accountNumber + 1;
      const { type, bank } = req.body;
      
      const user = UserHelper.findUserById(req.data.id);
      if (user) {
        const newAccount = new Account(
          {
            id: newId, accountNumber: newAccountNumber, type: type, owner: user, bank
          });
        accounts.push(newAccount);

        return res.status(201).json({
          success: 'true',
          message: 'Account is created successfully',
          data: newAccount,
        });
      }

      return res.status(403).json({
        success: 'false',
        error: 'Unauthorized',
      });
    } catch (error) {
      res.status(500).json({
        success: 'false',
        error: 'Something went wrong. Try again.',
      });
    }
  }

  // get all accounts
  static getAllAccounts(req, res) {
    try {
      if (req.body || req.params || req.query.id) {
        const id = parseInt(req.params.id) || parseInt(req.query.id);
        const { email, accountNumber } = req.query;
        const queryString = email || id || accountNumber;
        const user = UserHelper.findUserById(id) || UserHelper.findUserByEmail(email);
        const theQuery = Object.keys(req.query)[0];
        const accountsFound = [];

        accounts.map((account) => {
          if (account.id === id || queryString === (account.email || account.id || account.accountNumber)/* || queryString === ${account.${theQuery}} */) {
            accountsFound.push(account);
          }
        });
        if (accountsFound.length = 1) {
          return res.status(201).json({
            success: 'true',
            message: 'Account retrieved successfully',
            Account: accountsFound,
          });
        }
        if (accountFound.length > 1) {
          return res.status(201).json({
            success: 'true',
            message: 'Accounts retrieved successfully',
            Account: accountsFound,
          });
        }

        return res.status(404).json({
          success: 'false',
          message: 'No account found',
        });
      }

      if (accounts) {
        return res.status(201).json({
          success: 'true',
          message: 'Accounts retrieved successfully ',
          Accounts: [...accounts],
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: 'false',
        message: 'Something went wrong',
      });
    }
  }

  // get a specific account
  static getAccount(req, res) {
    try {
      const id = parseInt(req.params.id) || req.query.id;
      const { accountNumber } = req.query;
      let accountFound = 'false';
      accounts.map((account) => {
        if (account.id === id || account.accountNumber === accountNumber) {
          accountFound = account;
        }
      });
      if (accountFound) {
        return res.status(201).json({
          success: 'true',
          message: 'Accounts retrieved successfully',
          Account: accountFound,
        });
      }

      return res.status(404).json({
        success: 'false',
        message: 'Not found',
        Account: accountFound,
      });
    } catch (error) {
      return res.status(500).json({
        success: 'false',
        message: 'Something went wrong',
      });
    }
  }

  // update specific account
  static updateAccount(req, res) {
    try {
      const id = parseInt(req.params.id);
      const { accountNumber } = req.query;
      let accountFound = 'false';
      accounts.map((account) => {
        if (account.id === id || account.accountNumber === accountNumber) {
          accountFound = account;
        }
      });
      if (!accountFound) {
        return res.status(404).json({
          success: 'false',
          message: 'Account not found',
        });
      }
      accountFound.status = req.body.status || req.params.status || req.query.status;
      return res.status(200).json({
        success: 'true',
        message: 'Account {req.body.status}+\'d\'+ successfully',
      });
    } catch (error) {
      return res.status(500).json({
        success: 'false',
        message: 'Something went wrong',
      });
    }
  }

  // delete specific account
  static deleteAccount(req, res) {
    try {
      const id = parseInt(req.params.id);
      const { accountNumber } = req.body || req.params || req.query || '';
      let accountFound;
      let accountIndex;
      accounts.map((account, index) => {
        if (account.id === id || account.accountNumber === accountNumber) {
          accountFound = account;
          accountIndex = index;
        }
      });
      if (!accountFound) {
        return res.status(404).json({
          success: 'false',
          message: 'Account not found',
        });
      }
      accounts.splice(accountIndex, 1);
      return res.status(200).json({
        success: 'true',
        message: 'Account deleted successfully',
      });
    } catch (error) {
      return res.status(500).json({
        success: 'false',
        message: 'Something went wrong',
      });
    }
  }
}
