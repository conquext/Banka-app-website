import db from '../db';
import { body, validationResult } from 'express-validator/check';

const { users, accounts } = db;
import { auth } from '../middlewares';


class validate {
	validationError = (errors) => {
		const errorCode = errors.map(error => error.msg);
		return err;
	},


	static loginCheck(req, res, next){
		req.checkBody('firstName').isLength({ min: 1 }).withMessage('Field cannot be empty');
    	req.checkBody('email').isEmail().withMessage('Email is invalid');

		const errors = req.validationErrors();
		if (errors) {
			const err = auth.validationError(errors);
			return auth.errorResponse(res, 422, err);
		}
		next();
	}

	static signupCheck(req, res, next) {
		if( !req.data.type.cashier ){
			return res.status(403).json({
				success: 'false',
				error: 'Unathorized'
			});
		}
		req.checBody('name').isAlpha().withMessage('You should enter only alphabets')
		.exists().withMessage('Please enter your name');
		req.checkBody('name').isLength({min: 3}).withMessage('Name should contain more than 2 characters');
		req.checkBody('email').isEmail().withMessage('Email is invalid');
		req.checkBody('password').isAlphanumberic().withMessage('Password should be alphanumeric')
		.isLength({ min: 6 }).withMessage('Should be atleast 6 characters')
        .exists().withMessage('Password is required');
		
		const errors = req.validationErrors();
		if (errors) {
			const err = auth.validationError(errors);
			return auth.errorResponse(res, 422, err);
		}
		next();
	}

	static accountCheck (req, res, next){
		if( !req.data.type.admin ){
			return res.status(403).json({
				success: 'false',
				error: 'Unathorized'
			});
		}
        req.checkBody('type').isIn(['savings', 'current']).withMessage('Choose a valid account type')
            .exists()
			.withMessage('Specify account type'),
		req.checkBody('userId')
			.exists()
			.withMessage('specify account owner Id')
		req.checkBody('bank')
		.exists()
		.withMessage('Specify a bank')
				

				.withMessage('Specify account type'),
            body('openingBalance').isDecimal().withMessage('You should enter only decimal')
                .exists()
                .withMessage('Field cannot be empty'),
        ];
		next();
	}
	static transactionCheck (req, res, next) {
        const accNo = req.body.accountNumber;
        let accountFound = '';
        for(var i = 0; i < accounts.length; i++){
            if (accNo === accounts[i].accountNumber) {
				accountFound = accounts[i];
			}
		}

		if( req.body.type === 'credit') {
            if (!req.body.amount || req.body.amount <= 0) {
                return res.status(404).json({
                    success: 'false',
                    error: 'Provide amount greater than 0'
                });
            }
        }
        else if(req.body.type === 'debit' || (req.body.amount >  accountFound.balance)) {
			return res.status(422).json({
				success: 'false',
				error: 'Insufficient balance'
			});
		}
		next();
	}
}

validate = new validate();
export default validate;