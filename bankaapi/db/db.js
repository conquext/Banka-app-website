
let users = [
  {
    id = 1,
    name = 'Name1',
    email = 'email1@email.com',
    password = 'password1',
    dob = 01/01/1990,
    state = 'Lagos',
    country = 'Nigeria',
    phoneNumber = 080001,
    accountNumber = 1000,
    loggedIn = false,
    type = 'user',
    createdAt = new Date(1,1,2019),
    lastLoggedInAt = new Date(1,1,2019)
  },
  {
    id = 2,
    name = 'Name2',
    email = 'email2@email.com',
    password = 'password1',
    dob = 01/02/1991,
    state = 'Lagos',
    country = 'Nigeria',
    phoneNumber = 080002,
    accountNumber = 1001,
    loggedIn = false,
    type = 'user',
    createdAt = new Date(1,2,2019),
    lastLoggedInAt = new Date(1,2,2019)
  },
  {
    id = 3,
    name = 'Name3',
    email = 'email3@email.com',
    password = 'password1',
    dob = 01/03/1993,
    state = 'Lagos',
    country = 'Nigeria',
    phoneNumber = 080003,
    accountNumber = 1002,
    loggedIn = false,
    type = 'cashier',
    createdAt = new Date(1,3,2019),
    lastLoggedInAt = new Date(1,3,2019)
  },
]

let accounts = [
  {
    id: 1,
    accountNumber: 1000,
    createdOn: new Date(1, 1, 2019),
    owner: 'Name1',
    type: 'savings',
    bank: 'Bank of Andela',
    status: 'active',
    balance: 60
  },
  { id: 2,
    accountNumber: 1001,
    createdOn: new Date(1, 2, 2019),
    owner: 'Name2',
    type: 'savings',
    bank: 'Bank of Lagos',
    status: 'active',
    balance: 103
  },
  { id: 3,
    accountNumber: 1002,
    createdOn: new Date(1, 3, 2019),
    owner: 'Name3',
    type: 'Current',
    bank: 'Bank of Banka',
    status: 'active',
    balance: 35
  },
  { 
    id: 4,
    accountNumber: 1003,
    createdOn: new Date(1, 3, 2019),
    owner: 'Name1',
    type: 'Current',
    bank: 'Bank of Lagos',
    status: 'inactive',
    balance: 5
  },
]

let transactions = [
  {
    id: 1,
    createdOn: new Date(1, 1, 2019),
    transactionType: 'credit',
    type: 'savings',
    accountNumber: 0001,
    amount: 10.0,
    oldBalance: 60,
    newBalance: 70
  },
  {
    id: 2,
    createdOn: new Date(1, 2, 2019),
    transactionType: 'credit',
    type: 'savings',
    accountNumber: 0002,
    amount: 100.0,
    oldBalance: 103,
    newBalance: 203
  },
  {
    id: 3,
    createdOn: new Date(1, 3, 2019),
    transactionType: 'debit',
    type: 'savings',
    accountNumber: 0002,
    amount: 50.0,
    oldBalance: 203,
    newBalance: 153
  }
]

export {users, accounts, transactions};
