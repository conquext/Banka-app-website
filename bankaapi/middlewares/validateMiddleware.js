import { accounts, users } from '../db/db';

import authMiddleware from './authMiddleware';

export default class ValidateMiddleware {
  static validationError(errors) {
    const errorCode = errors.map(error => error.msg);
    return err;
  }


  static loginCheck(req, res, next) {
    req.checkBody('email').isLength({ min: 1 }).withMessage('Email is required');
  	req.checkBody('email').isEmail().withMessage('Email is invalid');
    req.checkBody('password').isLength({ min: 1 }).withMessage('Password is required');

    const errors = req.validationErrors();
    if (errors) {
      const err = authMiddleware.validationError(errors);
      return authMiddleware.errorResponse(res, 400, err);
    }
    next();
  }

  static signupCheck(req, res, next) {
    req.checkBody('firstName').isLength({ min: 1 }).withMessage('First name is required');
    req.checkBody('lastName').isLength({ min: 1 }).withMessage('Last name is required');
    req.checkBody('firstName').isLength({ min: 3 }).withMessage('First name should contain more than 2 characters');
    req.checkBody('firstName').isAlpha().withMessage('First name should only contain alphabets')
      .exists()
      .withMessage('Please enter your first name');
    req.checkBody('email').isLength({ min: 1 }).withMessage('Email is required');
    req.checkBody('password').isLength({ min: 1 }).withMessage('Password is required');
    req.checkBody('email').isEmail().withMessage('Email is invalid');
    // req.checkBody('password').isAlphaNumeric().withMessage('Password should be alphanumeric')
    req.checkBody('password').exists().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password should be atleast 6 characters');
    req.checkBody('type').isIn(['user', 'cashier', 'admin']).withMessage('Choose a valid user type')
      .exists()
      .withMessage('Specify user type');
      

    const errors = req.validationErrors();
    if (errors) {
      const err = authMiddleware.validationError(errors);
      return authMiddleware.errorResponse(res, 400, err);
    }
    next();
  }

  static accountCreateCheck(req, res, next) {
    
    req.checkBody('type').isIn(['savings', 'current']).withMessage('Choose a valid account type')
      .exists()
      .withMessage('Specify account type');
    // req.checkBody('openingBalance')
    //   .exists()
    //   .withMessage('Specify an opening balance');
    if (!req.data.type === 'user') {
      return res.status(403).json({
        status: 403,
        success: 'false',
        error: 'Unathorized',
      });
    }
    const errors = req.validationErrors();
    if (errors) {
      const err = authMiddleware.validationError(errors);
      return authMiddleware.errorResponse(res, 400, err);
    }
    next();
  }

  static accountUpdateCheck(req, res, next) {
    if (req.data.type !== 'admin') {
      return res.status(403).json({
        status: 403,
        success: 'false',
        error: 'Unathorized',
      });
    }
    req.checkBody('status').isIn(['activate', 'deactivate']).withMessage('Specify account status update action')
      .exists();
    const errors = req.validationErrors();
    if (errors) {
      const err = authMiddleware.validationError(errors);
      return authMiddleware.errorResponse(res, 400, err);
    }
    next();
  }

  static transactionCheck(req, res, next) {
    req.checkBody('accountNumber').exists().withMessage('Account Number is required');
    req.checkBody('accountNumber').isNumeric().withMessage('Enter a valid Account Number');
    req.checkBody('amount').exists().withMessage('Provide amount').isDecimal().withMessage('Enter a valid amount');
    req.checkBody('type').isIn(['credit', 'debit', 'transfer']).withMessage('Specify debit, credit or transfer');

    const { accountNumber, amount, type } = req.body;
    let accountFound = '';
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
        if (amount && accountFound.balance < amount) {
          return res.status(404).json({
            status: 404,
            success: 'false',
            error: 'Insufficient balance',
          });
        }
      }
      if (type === 'credit') {
        if (!amount || req.body.amount <= 0) {
          return res.status(404).json({
            status: 404,
            success: 'false',
            error: 'Provide amount greater than 0',
          });
        }
      }
    const errors = req.validationErrors();
    if (errors) {
      const err = authMiddleware.validationError(errors);
      return authMiddleware.errorResponse(res, 400, err);
    }
    next();
  }

  static validateUserUpdate(req, res, next) {
    req.checkBody('userId').isLength({ max: 0 }).withMessage('User Id cannot be updated');

    const errors = req.validationErrors();
    if (errors) {
      const err = authMiddleware.validationError(errors);
      return authMiddleware.errorResponse(res, 400, err);
    }
    next();
  }
}
