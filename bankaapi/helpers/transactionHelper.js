import bcrypt from 'bcrypt';
import { transactions } from '../db/db';

export default class TransactionHelper {
  static findTransaction(field, value) {
    const transactionFound = [];
    for (const transaction of transactions) {
      if (parseInt(transaction[field], 10) === parseInt(value, 10)) {
        // if (field === 'transactionId'){
        //   return transaction;
        // }
        transactionFound.push(transaction);
      }
    }
    return transactionFound;
  }

  static findTransactionById(transactionId) {
    return this.findTransaction('transactionId', transactionId);
  }

  static findTransactionByUserId(userId) {
    return this.findTransaction('transactionId', userId);
  }

  static findTransactionByAccountNumber(accountNumber) {
    return this.findTransaction('accountNumber', accountNumber);
  }
}
