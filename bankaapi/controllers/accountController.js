import db from '../db';
import { Account } from '../models/account';

const { users, accounts } = db;

class accountController {
  //creates an account
  static createAccount(req, res) {
    try{
      const newId = accounts[accounts.length - 1].id + 1;
      const newAccountNumber = accounts[accounts.length - 1].accountNumber + 1;
      const { userId, type, bank } = req.body;
      
      let userFound = 'false';
      users.map((user) => {
          if (user.Id === userId) {
              userFound = user;
          }
      });    
      if (userFound) {
        const newAccount = new Account (newId, newAccountNumber, userFound, bank);
        accounts.push(newAccount);
        
        return res.status(201).json({
          success: 'true',
          message: 'Account is created successfully',
          id: userId,
          type: type,
          accountNumber: accountNumber,
          bank: bank,
          data: newAccount
        });
      }
      else{
        return res.status(403).json({
          success: 'false',
          error: 'Unauthorized'
        });
      }
    }
    catch (error) {
      res.status(500).json({
        success: 'false',
        error: 'Something went wrong. Try again.'
      });
    };
  }
  //get all accounts
  static getAllAccounts(req, res) {
    try{
        return res.status(201).json({
            success: 'true',
            message: 'Accounts retrieved successfully ',
            Accounts: [...accounts]
          });
    }
    catch (error) {
        return res.status(500).json({
          success: 'false',
          message: 'Something went wrong'
        });
    }
  }
  //get a specific account
  static getAccount(req, res){
      try{
        const id = parseInt(req.params.id);
        let result = '';
        for(var i = 0; i < accounts.length; i++){
            if (id === accounts[i].id) {
                result = accounts[i];
                return res.status(201).json({
                    success: 'true',
                    message: 'Accounts retrieved successfully ',
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
  //update specific account
  static updateAccount(req, res) {
    try {
      const id = parseInt(req.params.id);
      const {accountNumber} = req.body || '';
      let accountFound;
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
      accountFound.status = req.body.status;
      return res.status(200).json({
          success: 'true',
          message: `Account {req.body.status}+'d'+ successfully`,
      });
    }
    catch (error) {
      return res.status(500).json({
          success: 'false',
          message: 'Something went wrong'
      });
    }
  }
  //delete specific account
  static deleteAccount(req, res) {
      try {
        const id = parseInt(req.params.id);
        const {accountNumber} = req.body || '';
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
            message: 'Account deleted successfuly',
        });
      }
      catch (error) {
        return res.status(500).json({
            success: 'false',
            message: 'Something went wrong'
        });
      }
  }
}
    
const accountController = new accountController();
export default accountController;