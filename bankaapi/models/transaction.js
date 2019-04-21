class Transaction {
  constructor(transactionId, accountNumber, amount = 0, type, cashier) {
    this.transactionId = transactionId;
    this.accountNumber = accountNumber;
    this.amount = amount;
    this.type = type;
    this.cashier = cashier || '';
    this.oldBalance = '';
    this.newBalance = '';
    this.createdOn = new Date().toLocaleString();
  }
}

/*
const transaction = [
  {
    {
      "id" : "Integer" ,
      "createdOn" : "DateTime" ,
      "type" : "String" , // credit or debit
      "accountNumber" : "Integer" ,
      "cashier" : "Integer" , // cashier who consummated the transaction
      "amount" : "Float" ,
      "oldBalance" : "Float" ,
      "newBalance" : "Float" ,
    }
  }
];
*/

export default Transaction;
