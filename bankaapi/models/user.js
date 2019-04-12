class User{
  constructor(id = '', name, email, password, dob = "", state = "", phoneNumber = ""){
      this.id = id;
      this.name = name;
      this.email = email;
      this.password = password;
      this.dob = dob;
      this.state = state;
      this.country = country;
      this.phoneNumber = phoneNumber;
      this.accountNumber = '';
      this.loggedIn = false;
      this.type = 'user';
      this.balance = null;
      this.createdAt = new Date();
      this.lastLoggedInAt = null
  }
  isLoggedIn(){
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
  setEmail(email){
      this.email = email;
  }
  getUserId(){
      return this.id;
  }
  getAccountNumber(){
      return this.accountNumber;
  }
  getType(){
      return this.type;
  }
  getDob() {
      return this.dob;
  }
  setDob(dob){
      this.dob = dob;
  }
  setUpdatedAt(){
      this.updatedAt = new Date;
  }
  isAdmin(){
      return this.type == 'admin';
  }
}

class Cashier extends User{
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

class Admin extends Cashier{
  constructor(name) {
    super(name);
    this.type = 'admin';
  }
  canDelete(user) {
    return true;
  }
  canDeactivate(account){
    return true;
  }
  canActivate(account){
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

export default { User };