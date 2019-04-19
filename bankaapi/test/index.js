import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
//import request from 'supertest';

const { expect } = chai;

chai.use(chaiHttp);
chai.should();

const apiVersion = '/api/v1'

const userURL = `${apiVersion}/users`;
const authLoginURL = `${apiVersion}/auth/login`;
const authSignupURL = `${apiVersion}/auth/signup`;
const accountURL = `${apiVersion}/accounts`;
const transactionURL = `${apiVersion}/transactions`;

let userToken = '';
let cashierToken = '';
let adminToken = '';

//var authenticatedUser = request.agent(app);
before((done) => {
  const userCredentials = {
    firstName: 'Shegs',
    lastName: 'Jolly',
    email: 'email12@email.com', 
    password: 'password1',
    confirmPassword: 'password1',
    type: 'user',
  };
  chai
  .request(app)
    .post(`${authSignupURL}`)
    .send(userCredentials)
    .end((err, res) => {
      console.log(res.body);
      userToken = res.body.data.token;
      done();
    });
});

before((done) => {
  const cashierCredentials = {
    firstName: 'Shegs',
    lastName: 'Jolly',
    email: 'email13@email.com', 
    password: 'password1',
    confirmPassword: 'password1',
    type: 'cashier',
  }
  chai
  .request(app)
    .post(`${authSignupURL}`)
    .send(cashierCredentials)
    .end((err, res) => {
      cashierToken = res.body.data.token;
      done();
    });
});

//var authenticatedAdmin = request.agent(app);
before(function(done){
  const adminCredentials = {
    firstName: 'Shegs',
    lastName: 'Jolly',
    email: 'admin12@email.com', 
    password: 'password1',
    confirmPassword: 'password1',
    type: 'admin',
  }
  chai
  .request(app)
    .post(`${authSignupURL}`)
    .send(adminCredentials)
    .end((err, res) => {
      adminToken = res.body.data.token;
      done();
    });
});


//Test default route
describe('Test default route', () => {
  // Test for default route
  it('Should return 200 for the default route', (done) => {
    chai
      .request(app)
      .get('/')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        done();
      });
  });
  // Test for getting undefined routes
  it('Should return 404 for routes not specified', (done) => {
    chai
      .request(app)
      .get('/another/undefined/route')
      .end((err, res) => {
        expect(res.status).to.equal(404);
        done();
      });
  });
  // Test for posting to undefined routes
  it('Should return 404 for undefined routes', (done) => {
    chai
      .request(app)
      .post('/another/undefined/route')
      .send({ random: 'random' })
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });
});
// Test Auth Controller for signup
describe('POST /api/v1/auth/signup', () => {
  it('should not register user with an empty email', (done) => {
    chai
      .request(app)
      .post(`${authSignupURL}`)
      .send({
        name: 'Adekunle Ajala',
        email: '',
        password: 'password1',
        confirmPassword: 'password1',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        // expect(res.body.success).to.be.equal('false');
        // expect(res.body.error).to.be.equal('Please enter your name');
        done();
      });
  });
});

describe('POST /api/v1/auth/signup', () => {
  it('should not register existing user', (done) => {
    chai
      .request(app)
      .post(`${authSignupURL}`)
      .send({
        firstName: 'Name',
        lastName: 'Name',
        type: 'user',
        email: 'email1@email.com',
        password: 'password1',
        confirmPassword: 'password1',
      })
      .end((err, res) => {
        expect(res).to.have.status(409);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('User already exists');
        done();
      });
  });
});
describe('POST /api/v1/auth/signup', () => {
  it('should not register user with an empty name', (done) => {
    chai
      .request(app)
      .post(`${authSignupURL}`)
      .send({
        firstName: '',
        lastName: 'Name',
        type: 'user',
        email: 'Ajala@banka.com',
        password: 'password1',
        confirmPassword: 'password1',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('First name is required');
        done();
      });
  });
});
describe('POST /api/v1/auth/signup', () => {
  it('should not register user with less than 3 characters in first name', (done) => {
    chai
      .request(app)
      .post(`${authSignupURL}`)
      .send({
        firstName: 'Na',
        lastName: 'Name',
        type: 'user',
        email: 'sw@gmail.com',
        password: 'password1',
        confirmPassword: 'password1',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal(
          'First name should contain more than 2 characters',
        );
        done();
      });
  });
});
describe('POST /api/v1/auth/signup', () => {
  it('should not register user with no password', (done) => {
    chai
      .request(app)
      .post(`${authSignupURL}`)
      .send({
        firstName: 'Name',
        lastName: 'Name',
        type: 'user',
        email: 'swall@gmail.com',
        password: '',
        confirmPassword: '',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('Password is required');
        done();
      });
  });
});
describe('POST /api/v1/auth/signup', () => {
  it('should not register user if password does not match', (done) => {
    chai
      .request(app)
      .post(`${authSignupURL}`)
      .send({
        firstName: 'Name',
        lastName: 'Name',
        type: 'user',
        email: 'swall@gmail.com',
        password: 'password1',
        confirm_password: 'password2',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('Passwords must match');
        done();
      });
  });
});
describe('POST /api/v1/auth/signup', () => {
  it('should use valid email', (done) => {
    chai
      .request(app)
      .post(`${authSignupURL}`)
      .send({
        firstName: 'Name',
        lastName: 'Name',
        type: 'user',
        email: 'swall.gmail.com',
        password: 'password1',
        confirmPassword: 'password2',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('Email is invalid');
        done();
      });
  });
});
describe('POST /api/v1/auth/signup', () => {
  it('should register user', (done) => {
    chai
      .request(app)
      .post(`${authSignupURL}`)
      .send({
        firstName: 'Name',
        lastName: 'Name',
        type: 'user',
        email: 'swall@gmail.com',
        password: 'password1',
        confirmPassword: 'password1',
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body.success).to.be.equal('true');
        //expect(res.body.user).to.have.key('userId', 'name', 'email', 'type');
        done();
      });
  });
});
  // Test Auth Controller for login
describe('POST /api/v1/auth/login', () => {
  it('should not login with incorrect email', (done) => {
    chai
      .request(app)
      .post(`${authLoginURL}`)
      .send({
        email: 'email0@email.com',
        password: 'password0',
      })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('Incorrect email or Wrong password');
        done();
      });
  });
});
describe('POST /api/v1/auth/login', () => {
  it('should not login with incorrect password', (done) => {
    chai
      .request(app)
      .post(`${authLoginURL}`)
      .send({
        email: 'email1@email.com',
        password: 'password1',
      })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('Incorrect email or Wrong password');
        done();
      });
  });
});
describe('POST /api/v1/auth/login', () => {
  it('should login a valid user', (done) => {
    chai
      .request(app)
      .post(`${authLoginURL}`)
      .send({
        email: 'email1@email.com',
        password: 'password0',
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.success).to.be.equal('true');
        //expect(res.body.data).to.have.key('id', 'email', 'type', 'token');
        done();
      });
  });
});
// Test Account Controller
describe('POST /api/v1/accounts', () => {
  it('should create a new bank account', (done) => {
    chai
    .request(app)
      .post(`${accountURL}`)
      .set('Authorization', userToken)
      .send({
        type: 'savings',
        bank: 'Bank of Lagos',
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body.success).to.be.equal('true');
        //expect(res.body.data).to.have.key('transactionId', 'accountNumber','user','bank','lastName', 'type','openingBalance',  'status',);
        done();
      });
  });
});

//   it('should require a bank', (done) => {
//     chai
//       .request(app)
//       .post(`${accountURL}`)
//       .set('Authorization', userToken)
//       .send({
//         type: 'savings',
//         bank: '',
//       })
//       .end((err, res) => {
//         expect(res).to.have.status(401);
//         expect(res.body.success).to.be.equal('false');
//         expect(res.body.error).to.be.equal('Specify a bank');
//         done();
//       });
//   });
// });
describe('GET /api/v1/accounts', () => {
  it('should not get accounts for non admin user', (done) => {
    chai
      .request(app)
      .get(`${accountURL}/2`)
      .set('Authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('Unauthorized');
        done();
      });
  });

  it('should get accounts', (done) => {
    chai
      .request(app)
      .get(`${accountURL}`)
      .set('Authorization', adminToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.success).to.be.equal('true');
        expect(res.body.message).to.be.equal('Accounts retrieved successfully');
        done();
      });
  });
});
describe('PATCH /api/v1/accounts/3', () => {
  it('should update accounts', (done) => {
    chai
      .request(app)
      .patch(`${accountURL}/3`)
      .set('Authorization', adminToken)
      .send({
        status: "deactivate",
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.success).to.be.equal('true');
        done();
      });
  });

  it('should not update accounts for non admin user', (done) => {
    chai
      .request(app)
      .patch(`${accountURL}/1`)
      .set('Authorization', userToken)
      .send({
        status: "deactivate",
      })
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('Unauthorized');
        done();
      });
  });

  it('should not update accounts that does not exist', (done) => {
    chai
      .request(app)
      .patch(`${accountURL}/1000000000`)
      .set('Authorization', adminToken)
      .send({
        status: "deactivate",
      })
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('Account not found');
        done();
      });
  });
});
describe('GET /api/v1/accounts/:accountId', () => {
  it('should not get accounts that does not exist', (done) => {
    chai
      .request(app)
      .get(`${accountURL}/1000000000`)
      .set('Authorization', adminToken)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('Account not found');
        done();
      });
  });

  // describe('GET /api/v1/accounts/2', () => {
  it('should get a specific account', (done) => {
    chai
      .request(app)
      .get(`${accountURL}/2`)
      .set('Authorization', adminToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.success).to.be.equal('true');
        done();
      });
  });
});
// describe('GET /api/v1/accounts?userId=1', () => {
  // it('should get all accounts of a specific user', (done) => {
  //   chai
  //     .request(app)
  //     .get('{accountURL}?userId=1')
  //     .set('Authorization', adminToken)
  //     .end((err, res) => {
  //       expect(res).to.have.status(200);
  //       expect(res.body.success).to.be.equal('true');
  //       expect(res.body.message).to.be.equal('Accounts retrieved successfully');
  //       done();
  //     });
  // });

// describe('GET /api/v1/accounts?email=email3@email.com', () => {
//   it('should get specific account of a user', (done) => {
//     chai
//       .request(app)
//       .get(`${accountURL}?email=email3@email.com`)
//       .set('Authorization', adminToken)
//       .end((err, res) => {
//         expect(res).to.have.status(200);
//         expect(res.body.success).to.be.equal('true');
//         expect(res.body.message).to.be.equal('Account retrieved successfully');
//         done();
//       });
//   });
// });

describe('DELETE /api/v1/accounts/1000000000', () => {
  it('should not delete accounts that does not exist', (done) => {
    chai
      .request(app)
      .delete(`${accountURL}/1000000000`)
      .set('Authorization', adminToken)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('Account not found');
        done();
      });
  });
  // describe('DELETE /api/v1/accounts/2', () => {
  it('should delete account', (done) => {
    chai
      .request(app)
      .delete(`${accountURL}/2`)
      .set('Authorization', adminToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.success).to.be.equal('true');
        done();
      });
  });
  // describe('DELETE /api/v1/accounts?userId=1', () => {
  it('should not delete account with user privilege', (done) => {
    chai
      .request(app)
      .delete(`${accountURL}/2`)
      .set('Authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('Unauthorized');
        done();
      });
  });
  // describe('DELETE /api/v1/accounts/2', () => {
  it('should not delete account with cashier privilege', (done) => {
    chai
      .request(app)
      .delete(`${accountURL}/2`)
      .set('Authorization', cashierToken)
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('Unauthorized');
        done();
      });
  });
});
//Test transaction controller
describe('POST /api/v1/transactions', () => {
  it('should not authorize user to make transactions', (done) => {
    chai
      .request(app)
      .post(`${transactionURL}`)
      .set('Authorization', userToken)
      .send({
        accountNumber: 1001,
        amount: 500,
        type: 'credit',
      })
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('Unauthorized');
        done();
      });
  });
  // describe('POST /api/v1/transactions', () => {
  it('should not autorize admin to make transactions', (done) => {
    chai
      .request(app)
      .post(`${transactionURL}`)
      .set('Authorization', adminToken)
      .send({
        accountNumber: 1001,
        amount: 500,
        type: 'credit',
      })
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('Unauthorized');
        done();
      });
  });
  // describe('POST /api/v1/transactions', () => {
  it('should perform a debit transaction', (done) => {
    chai
      .request(app)
      .post(`${transactionURL}`)
      .set('Authorization', cashierToken)
      .send({
        accountNumber: 1002,
        amount: 5,
        type: 'debit',
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.success).to.be.equal('true');
        done();
      });
  });
  //describe('POST /api/v1/transactions', () => {
  it('should perform a credit transaction', (done) => {
    chai
      .request(app)
      .post(`${transactionURL}`)
      .set('Authorization', cashierToken)
      .send({
        accountNumber: 1002,
        amount: 5,
        type: 'credit',
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.success).to.be.equal('true');
        done();
      });
  });
});
describe('GET /api/v1/transactions', () => {
  it('should not allow users to view all transactions', (done) => {
    chai
      .request(app)
      .get(`${transactionURL}`)
      .set('Authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('Unauthorized');
        done();
      });
  });
  //describe('GET /api/v1/transactions/3', () => {
  it('should not allow users to view other users transactions', (done) => {
    chai
      .request(app)
      .get(`${transactionURL}/3`)
      .set('Authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('Unauthorized');
        done();
      });
  });
// describe('GET /api/v1/transactions/2', () => {
//   it('should allow users to view own transactions', () => {
//     chai
//     .request(app)
//     .get(`${transactionURL}?userId=2`)
//     .set('Authorization', userToken)
//     .end((err, res) => {
//       expect(res).to.have.status(200);
//       expect(res.body.success).to.be.equal('success');
//       // expect(res.body.transactionFound).to.have.key(
//       //   'accountNumber',
//       //   'balance',
//       //   'oldbalance',
//       // );
//       done();
//     });
//   });
// });
  //describe('GET /api/v1/transactions?email=email3@email.com', () => {
  // it('should allow users to view own transactions', (done) => {
  //   chai
  //     .request(app)
  //     .get(`${transactionURL}?email=email3@email.com`)
  //     .send({
  //       data: { name: 'Name3', type: 'user' },
  //     })
  //     .end((err, res) => {
  //       expect(res).to.have.status(201);
  //       expect(res.body.success).to.be.equal('success');
  //       expect(res.body.transactionFound).to.have.key(
  //         'accountNumber',
  //         'balance',
  //         'oldbalance',
  //       );
  //       done();
  //     });
  // });
  // //describe('GET /api/v1/transactions?userId=3', () => {
  // it('should allow users to view own transactions', (done) => {
  //   chai
  //     .request(app)
  //     .get(`${transactionURL}?userId=3`)
  //     .send({
  //       data: { name: 'Name3', type: 'user' },
  //     })
  //     .end((err, res) => {
  //       expect(res).to.have.status(201);
  //       expect(res.body.success).to.be.equal('success');
  //       expect(res.body.transactionFound).to.have.key(
  //         'accountNumber',
  //         'balance',
  //         'oldbalance',
  //       );
  //       done();
  //     });
  // });
  //describe('GET /api/v1/transactions', () => {
  it('should  allow cashier  to view all transactions', (done) => {
    chai
      .request(app)
      .get(`${transactionURL}`)
      .set('Authorization', cashierToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.success).to.be.equal('true');
        // expect(res.body.accountFound).to.have.key(
        //   'accountNumber',
        //   'balance',
        //   'oldbalance',
        // );
        done();
      });
  });
// describe('GET /api/v1/transactions?email=name3@email.com', () => {
//   it('should allow cashier user to view all transactions of a specific user', (done) => {
//     chai
//       .request(app)
//       .get(`${transactionURL}?email=name3@email.com`)
//       .send({
//         data: { type: 'cashier' },
//       })
//       .end((err, res) => {
//         expect(res).to.have.status(200);
//         expect(res.body.success).to.be.equal('success');
//         expect(res.body.accountFound).to.have.key(
//           'accountNumber',
//           'balance',
//           'oldbalance',
//         );
//         done();
//       });
//   });
  //describe('GET /api/v1/transactions', () => {
  it('should  allow admin to view all transactions', (done) => {
    chai
      .request(app)
      .get(`${transactionURL}`)
      .set('Authorization', adminToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.success).to.be.equal('true');
        // expect(res.body.accountFound).to.have.key(
        //   'accountNumber',
        //   'balance',
        //   'oldbalance',
        // );
        done();
      });
  });
});
//describe('GET /api/v1/transactions?email=name3@email.com', () => {
//   it('should  allow admin user to view all transactions of a specific user', (done) => {
//     chai
//       .request(app)
//       .get(`${transactionURL}?email=name3@email.com`)
//       .send({
//         data: { type: 'admin' },
//       })
//       .end((err, res) => {
//         expect(res).to.have.status(200);
//         expect(res.body.success).to.be.equal('success');
//         expect(res.body.accountFound).to.have.key(
//           'accountNumber',
//           'balance',
//           'oldbalance',
//         );
//         done();
//       });
//   });
// });
describe('POST /api/v1/transactions', () => {
  it('should not perform transaction if account does not exist', (done) => {
    chai
      .request(app)
      .post(`${transactionURL}`)
      .set('Authorization', cashierToken)
      .send({
        accountNumber: 1001377773888,
        amount: 500,
        type: 'credit',
      })
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('Account not found');
        done();
      });
  });
});
describe('GET /api/v1/transactions/2', () => {
  it('should  allow admin user to view a specific transaction', (done) => {
    chai
      .request(app)
      .get(`${transactionURL}/2`)
      .set('Authorization', adminToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.success).to.be.equal('true');
        //expect(res.body).to.have.key('accountNumber', 'balance', 'oldbalance');
        done();
      });
  });
});
describe('GET /api/v1/transactions/1', () => {
  it('should  allow cashier user to view a specific transaction', (done) => {
    chai
      .request(app)
      .get(`${transactionURL}/3`)
      .set('Authorization', cashierToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.success).to.be.equal('true');
        // expect(res.body.transactions).to.have.key(
        //   'id',
        //   'oldBalance',
        //   'newBalance',
        //   amount,
        // );
        done();
      });
  });
});
describe('POST /api/v1/transactions', () => {
  it('should return fail transaction for insufficient balance in debit transaction', (done) => {
    chai
      .request(app)
      .post(`${transactionURL}`)
      .set('Authorization', cashierToken)
      .send({
        accountNumber: 1002,
        amount: 5000000000000,
        type: 'debit',
      })
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('Insufficient balance');
        done();
      });
  });
});