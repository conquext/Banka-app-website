export default class User {
  constructor({
    userId, firstName, lastName, email, type, password, dob, state, phoneNumber, country,
  }) {
    this.userId = userId || '';
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.dob = dob || '';
    this.state = state || '';
    this.country = country || '';
    this.phoneNumber = phoneNumber || '';
    this.accountNumber = '';
    this.loggedIn = false;
    this.type = type || 'user';
    this.balance = null;
    this.token = '',
    this.password = '',
    this.createdAt = new Date();
    this.lastLoggedInAt = null;
  }

  isLoggedIn() {
    return this.loggedIn;
  }

  getLastLoggedInAt() {
    return this.lastLoggedInAt;
  }

  logIn() {
    this.lastLoggedInAt = new Date();
    this.loggedIn = true;
  }

  logOut() {
    this.loggedIn = false;
  }

  getName() {
    return this.name;
  }

  setName(name) {
    this.name = name;
  }

  getEmail() {
    return this.email;
  }

  setEmail(email) {
    this.email = email;
  }

  getUserId() {
    return this.userId;
  }

  getAccountNumber() {
    return this.accountNumber;
  }

  getType() {
    return this.type;
  }

  getDob() {
    return this.dob;
  }

  setDob(dob) {
    this.dob = dob;
  }

  setUpdatedAt() {
    this.updatedAt = new Date();
  }

  isAdmin() {
    return this.type === 'admin';
  }
  getToken() {
    return this.token;
  }
  getPassword() {
    return this.password;
  }
  getUser() {
    return {
      token: this.token,
      id: this.userId, 
      firstName: this.firstName, 
      lastName: this.lastName,
      email: this.email,
      isAdmin: this.isAdmin,
    }
  }
}

class Cashier extends User {
  constructor(name) {
    super(name);
    this.type = 'cashier';
  }

  canDebit(user) {
    return true;
  }

  canCredit(user) {
    return true;
  }
}

class Admin extends Cashier {
  constructor(name) {
    super(name);
    this.type = 'admin';
  }

  canDelete(user) {
    return true;
  }

  canDeactivate(account) {
    return true;
  }

  canActivate(account) {
    return true;
  }
}

/*
const user = [
{
  “id” : "Integer" ,
  “email” : "String" ,
  “firstName” : "String" ,
  “lastName” : "String" ,
  “password” : "String" ,
  “type” : "String" , // client or staff
  “isAdmin” : "Boolean" , // must be a staff user account
}
];
*/
