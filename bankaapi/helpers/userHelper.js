import { users } from '../db/db';

export default class UserHelper {
  static findUser(field, value) {
    for (const user of users) {
      if (user[field] === value) {
        return user;
      }
    }
    return null;
  }

  static findUserById(id) {
    return this.findUser('id', id);
  }

  static findUserByEmail(email) {
    return this.findUser('email', email);
  }
}
