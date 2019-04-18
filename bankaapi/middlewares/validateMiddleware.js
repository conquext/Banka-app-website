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
      return authMiddleware.errorResponse(res, 422, err);
    }
    next();
  }

  static signupCheck(req, res, next) {
    req.checkBody('name').isLength({ min: 1 }).withMessage('Name is required');
    req.checkBody('name').isLength({ min: 3 }).withMessage('Name should contain more than 2 characters');
    req.checkBody('name').isAlpha().withMessage('Name can only contain alphabets')
      .exists()
      .withMessage('Please enter your name');
    req.checkBody('email').isLength({ min: 1 }).withMessage('Email is required');
    req.checkBody('password').isLength({ min: 1 }).withMessage('Password is required');
    req.checkBody('email').isEmail().withMessage('Email is invalid');
    // req.checkBody('password').isAlphaNumeric().withMessage('Password should be alphanumeric')
    req.checkBody('password').exists().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password should be atleast 6 characters');
      

    const errors = req.validationErrors();
    if (errors) {
      const err = authMiddleware.validationError(errors);
      return authMiddleware.errorResponse(res, 422, err);
    }
    next();
  }

  static accountCreateCheck(req, res, next) {
    
    req.checkBody('type').isIn(['savings', 'current']).withMessage('Choose a valid account type')
      .exists()
      .withMessage('Specify account type');
    req.checkBody('bank')
      .exists()
      .withMessage('Specify a bank');
    if (!req.data.type === 'user') {
      return res.status(403).json({
        success: 'false',
        error: 'Unathorized',
      });
    }
    const errors = req.validationErrors();
    if (errors) {
      const err = authMiddleware.validationError(errors);
      return authMiddleware.errorResponse(res, 422, err);
    }
    next();
  }

  static accountUpdateCheck(req, res, next) {
    if (req.data.type !== 'admin') {
      return res.status(403).json({
        success: 'false',
        error: 'Unathorized',
      });
    }
    req.checkBody('status').isIn(['activate', 'deactivate']).withMessage('Specify account status update action')
      .exists();
    const errors = req.validationErrors();
    if (errors) {
      const err = authMiddleware.validationError(errors);
      return authMiddleware.errorResponse(res, 422, err);
    }
    next();
  }

  static transactionCheck(req, res, next) {
    req.checkBody('accountNumber').exists().withMessage('Account Number is required');
    req.checkBody('accountNumber').isNumeric().withMessage('Enter a valid Account Number');
    req.checkBody('amount').exists().withMessage('Provide amount').isDecimal().withMessage('Enter a valid amount');
    req.checkBody('type').isIn(['credit', 'debit', 'transfer']).withMessage('Specify debit, credit or transfer');

    const accNo = req.body.accountNumber;
    let accountFound = null;
    for (let i = 0; i < accounts.length; i++) {
      if (accNo === accounts[i].accountNumber) {
        accountFound = accounts[i];
      }
    }

    if(!accountFound){
      return res.status(404).json({
        success: 'false',
        message: 'Account Not found'
      });
    }

    if (req.body.type === 'credit') {
      if (!req.body.amount || req.body.amount <= 0) {
        return res.status(422).json({
          success: 'false',
          error: 'Provide amount greater than 0',
        });
      }
    } else if (req.body.type === 'debit' && (req.body.amount > accountFound.balance)) {
      return res.status(422).json({
        success: 'false',
        error: 'Insufficient balance',
      });
    }
    const errors = req.validationErrors();
    if (errors) {
      const err = authMiddleware.validationError(errors);
      return authMiddleware.errorResponse(res, 422, err);
    }
    next();
  }

  static validateUserUpdate(req, res, next) {
    req.checkBody('userId').isLength({ max: 0 }).withMessage('User Id cannot be updated');

    const errors = req.validationErrors();
    if (errors) {
      const err = authMiddleware.validationError(errors);
      return authMiddleware.errorResponse(res, 422, err);
    }
    next();
  }
}
