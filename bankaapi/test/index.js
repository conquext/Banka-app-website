import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';


const { expect } = chai;

chai.use(chaiHttp);
const userURL = '/api/v1/users';
const authLoginURL = 'api/v1/auth/login';
const authSignupURL = 'api/v1/auth/signup';
const accountURL = '/api/v1/accounts';
const transactionURL = '/api/v1/transactions';

describe('Test default route', () => {
  // Test for default route
  it('Should return 200 for the default route', (done) => {
    chai.request(app)
      .get('/')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        done();
      });
  });
  // Test for getting undefined routes
  it('Should return 404 for routes not specified', (done) => {
    chai.request(app)
      .get('/another/undefined/route')
      .end((err, res) => {
        expect(res.status).to.equal(404);
        done();
      });
  });
  // Test for posting to undefined routes
  it('Should return 404 for undefined routes', (done) => {
    chai.request(app)
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
    chai.request(app)
      .post(`${authSignupURL}`)
      .send({
        name: 'Adekunle Ajala',
        email: '',
        password: 'password1',
        confirmPassword: 'password1'
      })
      .end((err, res) => {
        expect (res).to.have.status(422);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('Please enter your name');
        done();
      });
  });
});
  describe('POST /api/v1/auth/signup', () => {
    it('should not register existing user', (done) => {
      chai.request(app)
        .post(`${authSignupURL}`)
        .send({
          name: 'Name1',
          email = 'email1@email.com',
          password = 'password1',
          confirm_password: 'password1'
        })
        .end((err, res) => {
          expect (res).to.have.status(409);
          expect(res.body.success).to.be.equal('false');
          expect(res.body.error).to.be.equal('User already exists');
          done();
        });
    });
  it('should not register user with an empty name', (done) => {
    chai.request(app)
      .post(`${authSignupURL}`)
      .send({
        name: '',
        email: 'Ajala@banka.com',
        password: 'password1',
        confirmPassword: 'password1'
      })
      .end((err, res) => {
        expect (res).to.have.status(422);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('Please enter your name');
        done();
      });
  });
  it('should not register user with less than 3 characters', (done) => {
    chai.request(app)
      .post(`${authSignupURL}`)
      .send({
        name: 'Sw',
        email: 'sw@gmail.com',
        password: 'password1',
        confirm_password: 'password1'
      })
      .end((err, res) => {
        expect (res).to.have.status(422);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('Name should contain more than 2 characters');
        done();
      });
  });
  it('should not register user with no password', (done) => {
    chai.request(app)
      .post(`${authSignupURL}`)
      .send({
        name: 'Swall',
        email: 'swall@gmail.com',
        password: '',
        confirmPassword: ''
      })
      .end((err, res) => {
        expect (res).to.have.status(422);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('Password is required');
        done();
      });
  });
  it('should not register user if password does not match', (done) => {
    chai.request(app)
      .post(`${authSignupURL}`)
      .send({
        name: 'Swall',
        email: 'swall@gmail.com',
        password: 'password1',
        confirm_password: 'password2'
      })
      .end((err, res) => {
        expect (res).to.have.status(422);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('Passwords must match');
        done();
      });
  });
  it('should use valid email', (done) => {
    chai.request(app)
      .post(`${authSignupURL}`)
      .send({
        name: 'Swall',
        email: 'swall.gmail.com',
        password: 'password1',
        confirmPassword: 'password2'
      })
      .end((err, res) => {
        expect (res).to.have.status(422);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('Email is invalid');
        done();
      });
  });
  it('should register user', (done) => {
    chai.request(app)
      .post(`${authSignupURL}`)
      .send({
        name: 'Swall',
        email: 'swall.gmail.com',
        password: 'password1',
        confirmPassword: 'password1'
      })
      .end((err, res) => {
        expect (res).to.have.status(201);
        expect(res.body.success).to.be.equal('true');
        expect(res.body.user).to.have.key('id', 'name', 'email', 'type');
        done();
      });
  });

  // Test Auth Controller for login
  it('should not login with incorrect email', (done) => {
    chai.request(app)
      .post(`${authloginURL}`)
      .send({
        email = 'email0@email.com',
        password = 'password1',
      })
      .end((err, res) => {
        expect (res).to.have.status(401);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('Incorrect email');
        done();
      });
  });

  it('should not login with incorrect password', (done) => {
    chai.request(app)
      .post(`${authloginURL}`)
      .send({
        email = 'email1@email.com',
        password = 'password0',
      })
      .end((err, res) => {
        expect (res).to.have.status(401);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('Wrong password');
        done();
      });
  });

  it('should login a valid user', (done) => {
    chai.request(app)
      .post(`${authloginURL}`)
      .send({
        email = 'email1@email.com',
        password = 'password1'
      })
      .end((err, res) => {
        expect (res).to.have.status(200);
        expect(res.body.success).to.be.equal('true');
        expect(res.body.data).to.have.key('id', 'email', 'type', 'token');
        done();
      });
  });
});

// Test Account Controller
describe('POST /api/v1/transactions', () => {
  it('should create a new transaction', (done) => {
    chai.request(app)
      .post(`${transactionURL}`)
      .send({
        userId: 2,
        type: 'savings',
        bank: 'Bank of Lagos'
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body.success).to.be.equal('true');
        expect(res.body.data).to.have.key('id', 'accountNumber', 'user', 'bank', 'lastName', 'type', 'openingBalance', 'status');
        done();
      });
  });
  it('should require a bank', (done) => {
    chai.request(app)
      .post(`${accountURL}`)
      .send({
        userId: 2,
        type: 'savings',
        bank: ''
      })
      .end((err, res) => {
        expect(res).to.have.status(422);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('Specify a bank');
        done();
      });
  });

  it('should not get accounts for non admin user', (done) => {
    chai.request(app)
      .get(`${accountURL}`)
      .send({
        data: {type: 'user'},
      })
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('Unathorized');
        done();
      });
  });

  it('should get accounts', (done) => {
    chai.request(app)
      .get(`${accountURL}`)
      .send({
        data: {type: 'admin'},
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.success).to.be.equal('true');
        expect(res.body.error).to.be.equal('Accounts retrieved successfully');
        done();
      });
  });

  it('should update accounts', (done) => {
    chai.request(app)
      .patch(`${accountURL}`)
      .send({
        data: {type: 'admin'},
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.success).to.be.equal('true');
        done();
      });
  });

  it('should not update accounts for non admin user', (done) => {
    chai.request(app)
      .patch(`${accountURL}`)
      .send({
        data: {type: 'user'},
      })
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('Unathorized');
        done();
      });
  });

  it('should not update accounts that does not exist', (done) => {
    chai.request(app)
      .patch(`${accountURL}/1000000000`)
      .send({
        data: {type: 'admin'},
      })
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('Account not found');
        done();
      });
  });

  it('should not get accounts that does not exist', (done) => {
    chai.request(app)
      .get(`${accountURL}1000000000`)
      .send({
        data: {type: 'admin'},
      })
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('Account not found');
        done();
      });
  });

  it('should get a specific account', (done) => {
    chai.request(app)
      .get(`${accountURL}`)
      .send({
        data: {type: 'admin'},
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.success).to.be.equal('true');
        expect(res.body.Account).to.have.key('id', 'accountNumber', 'user', 'bank', 'balance')
        done();
      });
  });
  it('should get all accounts of a specific user', (done) => {
    chai.request(app)
      .get(`{accountURL}?owner=Name1`)
      .send({
        data: {type: 'admin'},
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.success).to.be.equal('true');
        expect(res.body.message).to.be.equal('Accounts retrieved successfully')
        done();
      });
  });
  it('should get specific account of a user', (done) => {
    chai.request(app)
      .get(`${accountURL}?email=email3@email.com`)
      .send({
        data: {type: 'admin'},
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.success).to.be.equal('true');
        expect(res.body.message).to.be.equal('Account retrieved successfully')
        done();
      });
  });
  it('should not delete accounts that does not exist', (done) => {
    chai.request(app)
      .delete(`${accountURL}/1000000000`)
      .send({
        data: {type: 'admin'},
      })
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.success).to.be.equal('true');
        expect(res.body.error).to.be.equal('Account deleted successfully found');
        done();
      });
  });

  it('should delete account', (done) => {
    chai.request(app)
      .delete(`${accountURL}/2`)
      .send({
        data: {type: 'admin'},
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('Account not found');
        done();
      });
  });
  it('should not delete account with user privilege', (done) => {
    chai.request(app)
      .delete(`${accountURL}/2`)
      .send({
        data: {type: 'user'},
      })
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('Unuthorized');
        done();
      });
  });
  it('should not delete account with cashier privilege', (done) => {
    chai.request(app)
      .delete(`${accountURL}/2`)
      .send({
        data: {type: 'cashier'},
      })
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('Unuthorized');
        done();
      });
  });
});

//Test transaction controllerreturn 
describe('POST /api/v1/accounts', () => {
  it('should not authorize non cashier user to make transactions', (done) => {
    chai.request(app)
      .post(`${transactionURL}`)
      .send({
        accountNumber: 1001,
        amount: 500,
        type: credit,
        data: {type: 'user'}
      })
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('Unauthorized');
        done();
      });
  });
  it('should not autorize non cashier user to make transactions', (done) => {
    chai.request(app)
      .post(`${transactionURL}`)
      .send({
        accountNumber: 1001,
        amount: 500,
        type: credit,
        data: {type: 'admin'}
      })
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('Unauthorized');
        done();
      });
  });
  it('should perform the transaction', (done) => {
    chai.request(app)
      .post(`${transactionURL}`)
      .send({
        accountNumber: 1001,
        amount: 500,
        type: credit,
        data: {type: 'cashier'}
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body.success).to.be.equal('true');
        done();
      });
  });
  it('should perform the transaction', (done) => {
    chai.request(app)
      .post(`${transactionURL}`)
      .send({
        accountNumber: 1001,
        amount: 5,
        type: debit,
        data: {type: 'cashier'}
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.success).to.be.equal('true');
        expect(res.body.transactionFound).to.have.key('accountNumber', 'balance', 'oldbalance');
        done();
      });
  });
  it('should not allow users to view all transactions', (done) => {
    chai.request(app)
      .get(`${transactionURL}`)
      .send({
        data: {type: 'user'}
      })
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('Unauthorized');
        done();
      });
  });
  it('should not allow users to view other users transactions', (done) => {
    chai.request(app)
      .get(`${transactionURL}/3`)
      .send({
        data: {name: 'Name2', type: 'user'}
      })
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('Unauthorized');
        done();
      });
  });
  it('should allow users to view own transactions', (done) => {
    chai.request(app)
      .get(`${transactionURL}/2`)
      .send({
        data: {name: 'Name2', type: 'user'}
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body.success).to.be.equal('success');
        expect(res.body.transactionFound).to.have.key('accountNumber', 'balance', 'oldbalance');    
        done();
      });
  });
  it('should allow users to view own transactions', (done) => {
    chai.request(app)
      .get(`${transactionURL}?email=email3@email.com`)
      .send({
        data: {name: 'Name3', type: 'user'}
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body.success).to.be.equal('success');
        expect(res.body.transactionFound).to.have.key('accountNumber', 'balance', 'oldbalance');    
        done();
      });
  });
  it('should allow users to view own transactions', (done) => {
    chai.request(app)
      .get(`${transactionURL}?id=3`)
      .send({
        data: {name: 'Name3', type: 'user'}
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body.success).to.be.equal('success');
        expect(res.body.transactionFound).to.have.key('accountNumber', 'balance', 'oldbalance');    
        done();
      });
  });
  it('should  allow cashier user to view all transactions', (done) => {
    chai.request(app)
      .post(`${transactionURL}`)
      .send({
        data: {type: 'cashier'}
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.success).to.be.equal('success');
        expect(res.body.accountFound).to.have.key('accountNumber', 'balance', 'oldbalance');    
        done();
      });
  });
  it('should allow cashier user to view all transactions of a specific user', (done) => {
    chai.request(app)
      .post(`${transactionURL}?email=name3@email.com`)
      .send({
        data: {type: 'cashier'}
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.success).to.be.equal('success');
        expect(res.body.accountFound).to.have.key('accountNumber', 'balance', 'oldbalance');    
        done();
      });
  });
  it('should  allow admin user to view all transactions', (done) => {
    chai.request(app)
      .post(`${transactionURL}`)
      .send({
        data: {type: 'admin'}
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.success).to.be.equal('success');
        expect(res.body.accountFound).to.have.key('accountNumber', 'balance', 'oldbalance');        
        done();
      });
  });
  it('should  allow admin user to view all transactions of a specific user', (done) => {
    chai.request(app)
      .post(`${transactionURL}?email=name3@email.com`)
      .send({
        data: {type: 'admin'}
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.success).to.be.equal('success');
        expect(res.body.accountFound).to.have.key('accountNumber', 'balance', 'oldbalance');    
        done();
      });
  });
  it('should not perform transaction if account does not exist', (done) => {
    chai.request(app)
      .post(`${transactionURL}`)
      .send({
        accountNumber: 1001377773888,
        amount: 500,
        type: credit,
        data: {type: 'cashier'}
      })
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body.success).to.be.equal('fail');
        expect(res.body.error).to.be.equal('Account not found');
        done();
      });
  });
  it('should  allow admin user to view a specific account', (done) => {
    chai.request(app)
      .post(`${transactionURL}/id`)
      .send({
        data: {type: 'admin'}
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.success).to.be.equal('success');
        expect(res.body).to.have.key('accountNumber', 'balance', 'oldbalance');        
        done();
      });
  });
  it('should  allow cashier user to view a specific account', (done) => {
    chai.request(app)
      .post(`${transactionURL}/id`)
      .send({
        data: {type: 'cashier'}
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.success).to.be.equal('success');
        expect(res.body.transactions).to.have.key('id', 'oldBalance', 'newBalance', amount);        
        done();
      });
  });
  it('should return fail transaction for insufficient balance in debit transaction', (done) => {
    chai.request(app)
      .post(`${transactionURL}`)
      .send({
        accountNumber: 1001,
        amount: 5000000000000,
        type: debit,
        data: {type: 'cashier'}
      })
      .end((err, res) => {
        expect(res).to.have.status(422);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('Insufficient balance');
        done();
      });
  });
});
