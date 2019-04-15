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
    req.checkBody('confirmPassword').isLength({ min: 1 }).withMessage('Confirm Password');

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
    req.checkBody('name').isAlpha().withMessage('You should enter only alphabets')
      .exists()
      .withMessage('Please enter your name');
    req.checkBody('email').isLength({ min: 1 }).withMessage('Email is required');
    req.checkBody('password').isLength({ min: 1 }).withMessage('Password is required');
    req.checkBody('email').isEmail().withMessage('Email is invalid');
    // req.checkBody('password').isAlphaNumeric().withMessage('Password should be alphanumeric')
    req.checkBody('password').isLength({ min: 6 }).withMessage('Should be atleast 6 characters')
      .exists()
      .withMessage('Password is required');

    const errors = req.validationErrors();
    if (errors) {
      const err = authMiddleware.validationError(errors);
      return authMiddleware.errorResponse(res, 422, err);
    }
    next();
  }

  static accountCheck(req, res, next) {
    if (!req.data.type.admin) {
      return res.status(403).json({
        success: 'false',
        error: 'Unathorized',
      });
    }
    req.checkBody('type').isIn(['savings', 'current']).withMessage('Choose a valid account type')
      .exists()
      .withMessage('Specify account type');
    req.checkBody('userId')
      .exists()
      .withMessage('specify account owner Id');
    req.checkBody('bank')
      .exists()
      .withMessage('Specify a bank');

    const errors = req.validationErrors();
    if (errors) {
      const err = authMiddleware.validationError(errors);
      return authMiddleware.errorResponse(res, 422, err);
    }
    next();
  }

  static transactionCheck(req, res, next) {
    const accNo = req.body.accountNumber;
    let accountFound = '';
    for (let i = 0; i < accounts.length; i++) {
      if (accNo === accounts[i].accountNumber) {
        accountFound = accounts[i];
      }
    }

    if (req.body.type === 'credit') {
      if (!req.body.amount || req.body.amount <= 0) {
        return res.status(404).json({
          success: 'false',
          error: 'Provide amount greater than 0',
        });
      }
    } else if (req.body.type === 'debit' || (req.body.amount > accountFound.balance)) {
      return res.status(422).json({
        success: 'false',
        error: 'Insufficient balance',
      });
    }
    next();
  }

  static validateUserUpdate(req, res, next) {
    req.checkBody('id').isLength({ max: 0 }).withMessage('Id cannot be updated');

    const errors = req.validationErrors();
    if (errors) {
      const err = authMiddleware.validationError(errors);
      return authMiddleware.errorResponse(res, 422, err);
    }
    next();
  }
}
