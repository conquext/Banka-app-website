import { users } from '../db/db';

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
}
