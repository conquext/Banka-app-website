import bcrypt from 'bcrypt';
import { users, transactions } from '../db/db';

export default class UserHelper {
  static findUser(field, value) {
    for (const user of users) {
      if (user[field] == value) {
        return user;
      }
    }
    return null;
  }

  static findUserById(userId) {
    return this.findUser('userId', userId);
  }

  static findUserByEmail(email) {
    return this.findUser('email', email);
  }

  static findUserByAccountNumber(accountNumber){
    for (const user of users) {
      if (parseInt(user.accountNumber, 10) === parseInt(accountNumber, 10)) {
       return user;
      }
    }
  }

  static findUserByTransactionId(transactionId){
    let accountNumber, userFound = null;
    transactions.map((transaction) => {
      if (transaction.transactionId === transactionId){
        accountNumber = transaction.accountNumber;
      }
    });
    users.map((user) => {
      if (user.accountNumber === accountNumber){
        userFound = user;
      }
    });
    return userFound;
  }

  static hashPassword(password) {
    const salt = bcrypt.genSaltSync(15);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
  }

  static comparePassword(password, hash) {
    return bcrypt.compareSync(password, hash);
  }
}
