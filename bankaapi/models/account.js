class Account {
  constructor({
    accountId, type, accountNumber, userId, bank,
  }) {
    this.accountId = accountId;
    this.accountNumber = accountNumber;
    this.createdOn = new Date().toLocaleString();
    this.userId = userId;
    this.owner = this.userId;
    this.type = type;
    this.bank = bank || '';
    this.status = 'active';
    this.balance = 0;
    this.deleted = 'false';
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
  delete(){
    this.deleted = 'true';
  }
  isDeleted(){
  return this.deleted;
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
