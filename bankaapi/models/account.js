class Account {
  constructor({
    id, type, accountNumber, user, bank,
  }) {
    this.id = id || '';
    this.accountNumber = accountNumber || '';
    this.createdOn = new Date().toLocaleString();
    this.owner = user || {};
    this.type = type || 'savings';
    this.bank = bank || '';
    this.status = 'active';
    this.balance = 0;
  }
  /*
  setStatus(status) {
    this.status = status;
  }
  getStatus(){
    return this.status;
  }
  getType(){
    return this.type;
  }
  getBalance(){
    return this.balance;
  }
  credit(amount){
    this.balance+= amount;
  }
  debit(amount){
    if(this.balance >= amount){
      this.balance-= amount;
    }
  }
  */
}


/*
const account = [
  {
    {
      "id" : "Integer" ,
      "accountNumber" : "Integer" ,
      "createdOn" : "DateTime" ,
      "owner" : "Integer" , // user id
      "type" : "String" , // savings, current
      "status" : "String" , // draft, active, or dormant
      "balance" : "Float" ,
    }
  }
];
*/

export default Account;
