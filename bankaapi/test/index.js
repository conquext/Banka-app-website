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

before((done) => {
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
  it('Should return 200 for the home route', (done) => {
    chai
      .request(app)
      .get('/api/v1/auth')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.success).to.be.equal('true');
        expect(res.body.message).to.be.equal('Welcome to Banka API');
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
        firstName: 'Ajala',
        lastName: 'Adekunle',
        email: '',
        password: 'password1',
        confirmPassword: 'password1',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.success).to.be.equal('false');
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
   it('should use valid email', (done) => {
    chai
      .request(app)
      .post(`${authSignupURL}`)
      .send({
        firstName: 'Name',
        lastName: 'Name',
        type: 'user',
        password: 'password1',
        confirmPassword: 'password2',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('Email is required');
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
        expect(res.body.data).to.have.key('token', 'id','firstName','lastName', 'email','type',  'isAdmin');
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
  it('should not login without email', (done) => {
    chai
      .request(app)
      .post(`${authLoginURL}`)
      .send({
        email: '',
        password: 'password1',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('Email is required');
        done();
      });
  });
});
describe('POST /api/v1/auth/login', () => {
  it('should not login without a valid email', (done) => {
    chai
      .request(app)
      .post(`${authLoginURL}`)
      .send({
        email: 'swall.gmail.com',
        password: 'password1',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('Email is invalid');
        done();
      });
  });
});
describe('POST /api/v1/auth/login', () => {
  it('should not login without a password', (done) => {
    chai
      .request(app)
      .post(`${authLoginURL}`)
      .send({
        email: 'swall@gmail.com',
        password: '',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('Password is required');
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

// Test User Controller
describe('GET /api/v1/users', () => {
 it('should not return result without token authentication', (done) => {
  chai
  .request(app)
    .get(`${userURL}`)
    .end((err, res) => {
      expect(res).to.have.status(403);
      expect(res.body.success).to.be.equal('false');
      expect(res.body.error).to.be.equal('Unathorized. Token not found');
      //expect(res.body.data).to.have.key('transactionId', 'accountNumber','user','bank','lastName', 'type','openingBalance',  'status',);
      done();
    });
  });
  it('should not return result with wrong token authentication', (done) => {
    chai
    .request(app)
    .get(`${userURL}`)
    .set('Authorization', 'erty&trfd0994$dsds')
    .end((err, res) => {
      expect(res).to.have.status(403);
      expect(res.body.success).to.be.equal('false');
      expect(res.body.error).to.be.equal('Unathorized. Token invalid. Please login');
      //expect(res.body.data).to.have.key('transactionId', 'accountNumber','user','bank','lastName', 'type','openingBalance',  'status',);
      done();
    });
  });
  it('should return all users for admin', (done) => {
    chai
    .request(app)
      .get(`${userURL}`)
      .set('Authorization', adminToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.success).to.be.equal('true');
        expect(res.body.message).to.be.equal('Users retrieved successfully');
        //expect(res.body.data).to.have.key('transactionId', 'accountNumber','user','bank','lastName', 'type','openingBalance',  'status',);
        done();
      });
  });
  it('should return all users for cashier', (done) => {
    chai
    .request(app)
      .get(`${userURL}`)
      .set('Authorization', cashierToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.success).to.be.equal('true');
        expect(res.body.message).to.be.equal('Users retrieved successfully');
        //expect(res.body.data).to.have.key('transactionId', 'accountNumber','user','bank','lastName', 'type','openingBalance',  'status',);
        done();
      });
  });
  it('should not return all users for user', (done) => {
    chai
    .request(app)
      .get(`${userURL}`)
      .set('Authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('Unauthorized');
        //expect(res.body.data).to.have.key('transactionId', 'accountNumber','user','bank','lastName', 'type','openingBalance',  'status',);
        done();
      });
  });
});
describe('GET /api/v1/users', () => {
  it('should return a specific user for admin', (done) => {
    chai
    .request(app)
      .get(`${userURL}/2`)
      .set('Authorization', adminToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.success).to.be.equal('true');
        expect(res.body.message).to.be.equal('User retrieved successfully');
        //expect(res.body.data).to.have.key('transactionId', 'accountNumber','user','bank','lastName', 'type','openingBalance',  'status',);
        done();
      });
  });
  it('should return a specific user for cashier', (done) => {
    chai
    .request(app)
      .get(`${userURL}/3`)
      .set('Authorization', cashierToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.success).to.be.equal('true');
        expect(res.body.message).to.be.equal('User retrieved successfully');
        //expect(res.body.data).to.have.key('transactionId', 'accountNumber','user','bank','lastName', 'type','openingBalance',  'status',);
        done();
      });
  });
  it('should not return other users to a user', (done) => {
    chai
    .request(app)
      .get(`${userURL}/4`)
      .set('Authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('Unauthorized');
        //expect(res.body.data).to.have.key('transactionId', 'accountNumber','user','bank','lastName', 'type','openingBalance',  'status',);
        done();
      });
  });
  it('should return user\'s own account for user', (done) => {
    chai
    .request(app)
      .get(`${userURL}/6`)
      .set('Authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.success).to.be.equal('true');
        //expect(res.body.data).to.have.key('transactionId', 'accountNumber','user','bank','lastName', 'type','openingBalance',  'status',);
        done();
      });
  });
});
describe('PUT /api/v1/users/:userId', () => {
  it('should update a specific user account for admin', (done) => {
    chai
    .request(app)
      .put(`${userURL}/7`)
      .set('Authorization', adminToken)
      .send({
        state: 'Lagos',
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.success).to.be.equal('true');
        expect(res.body.message).to.be.equal('User updated successfully');
        //expect(res.body.data).to.have.key('transactionId', 'accountNumber','user','bank','lastName', 'type','openingBalance',  'status',);
        done();
      });
  });
  it('should not update userId', (done) => {
    chai
    .request(app)
      .put(`${userURL}/2`)
      .set('Authorization', adminToken)
      .send({
        userId: 5,
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('User Id cannot be updated');
        //expect(res.body.data).to.have.key('transactionId', 'accountNumber','user','bank','lastName', 'type','openingBalance',  'status',);
        done();
      });
  });
  it('should not update user that does not exist', (done) => {
    chai
    .request(app)
      .put(`${userURL}/111112`)
      .set('Authorization', adminToken)
      .send({
        state: 'Oyo',
      })
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('User not found');
        //expect(res.body.data).to.have.key('transactionId', 'accountNumber','user','bank','lastName', 'type','openingBalance',  'status',);
        done();
      });
  });
  it('should not update a specific user account by a cashier', (done) => {
    chai
    .request(app)
      .put(`${userURL}/2`)
      .set('Authorization', cashierToken)
      .send({
        state: 'Lagos',
      })
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('Unauthorized');
        //expect(res.body.data).to.have.key('transactionId', 'accountNumber','user','bank','lastName', 'type','openingBalance',  'status',);
        done();
      });
  });
  it('should not update a specific user account by a user', (done) => {
    chai
    .request(app)
      .put(`${userURL}/2`)
      .set('Authorization', userToken)
      .send({
        state: 'Lagos',
      })
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('Unauthorized');
        //expect(res.body.data).to.have.key('transactionId', 'accountNumber','user','bank','lastName', 'type','openingBalance',  'status',);
        done();
      });
  });
  it('should update a specific user account by own user', (done) => {
    chai
    .request(app)
      .put(`${userURL}/6`)
      .set('Authorization', userToken)
      .send({
        state: 'Lagos',
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.success).to.be.equal('true');
        expect(res.body.message).to.be.equal('User updated successfully');
        //expect(res.body.data).to.have.key('transactionId', 'accountNumber','user','bank','lastName', 'type','openingBalance',  'status',);
        done();
      });
  });
});
describe('PATCH /api/v1/users/1', () => {
  it('should promote a specific user account for admin', (done) => {
    chai
    .request(app)
      .patch(`${userURL}/7`)
      .set('Authorization', adminToken)
      .send({
        type: 'cashier',
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.success).to.be.equal('true');
        expect(res.body.message).to.be.equal('User promoted successfully');
        //expect(res.body.data).to.have.key('transactionId', 'accountNumber','user','bank','lastName', 'type','openingBalance',  'status',);
        done();
      });
  });
  it('should not promote user that does not exist', (done) => {
    chai
    .request(app)
      .patch(`${userURL}/111112`)
      .set('Authorization', adminToken)
      .send({
        type: 'cashier',
      })
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('User not found');
        //expect(res.body.data).to.have.key('transactionId', 'accountNumber','user','bank','lastName', 'type','openingBalance',  'status',);
        done();
      });
  });
  it('should not promote user by a cashier', (done) => {
    chai
    .request(app)
      .patch(`${userURL}/2`)
      .set('Authorization', cashierToken)
      .send({
        type: 'cashier',
      })
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('Unauthorized');
        //expect(res.body.data).to.have.key('transactionId', 'accountNumber','user','bank','lastName', 'type','openingBalance',  'status',);
        done();
      });
  });
  it('should not promote user by a user', (done) => {
    chai
    .request(app)
      .patch(`${userURL}/2`)
      .set('Authorization', userToken)
      .send({
        type: 'cashier',
      })
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('Unauthorized');
        //expect(res.body.data).to.have.key('transactionId', 'accountNumber','user','bank','lastName', 'type','openingBalance',  'status',);
        done();
      });
  });
});
describe('DELETE /api/v1/users/1', () => {
  it('should promote a specific user account for admin', (done) => {
    chai
    .request(app)
      .delete(`${userURL}/1`)
      .set('Authorization', adminToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.success).to.be.equal('true');
        expect(res.body.message).to.be.equal('User deleted successfully');
        //expect(res.body.data).to.have.key('transactionId', 'accountNumber','user','bank','lastName', 'type','openingBalance',  'status',);
        done();
      });
  });
  it('should not delete user that does not exist', (done) => {
    chai
    .request(app)
      .delete(`${userURL}/111112`)
      .set('Authorization', adminToken)
      .send({
        type: 'cashier',
      })
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('User not found');
        //expect(res.body.data).to.have.key('transactionId', 'accountNumber','user','bank','lastName', 'type','openingBalance',  'status',);
        done();
      });
  });
  it('should not delete user by a cashier', (done) => {
    chai
    .request(app)
      .delete(`${userURL}/2`)
      .set('Authorization', cashierToken)
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('Unauthorized');
        //expect(res.body.data).to.have.key('transactionId', 'accountNumber','user','bank','lastName', 'type','openingBalance',  'status',);
        done();
      });
  });
  it('should not delete user by a user', (done) => {
    chai
    .request(app)
      .delete(`${userURL}/2`)
      .set('Authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('Unauthorized');
        //expect(res.body.data).to.have.key('transactionId', 'accountNumber','user','bank','lastName', 'type','openingBalance',  'status',);
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
        expect(res.body.message).to.be.equal('Account is created successfully');            
        expect(res.body.data).to.have.key('accountId', 'accountNumber', 'bank', 'createdOn', 'deleted', 'owner', 'status', 'type','userId','balance');
        done();
      });
  });
  it('should not create a new bank account for a cashier', (done) => {
    chai
    .request(app)
      .post(`${accountURL}`)
      .set('Authorization', cashierToken)
      .send({
        type: 'savings',
        bank: 'Bank of Lagos',
      })
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('Unauthorized');
        //expect(res.body.data).to.have.key('transactionId', 'accountNumber','user','bank','lastName', 'type','openingBalance',  'status',);
        done();
      });
  });
  it('should require a type', (done) => {
    chai
      .request(app)
      .post(`${accountURL}`)
      .set('Authorization', userToken)
      .send({
        type: '',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('Choose a valid account type');
        done();
      });
  });
});
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
  it('should not activate account that is already activated', (done) => {
    chai
      .request(app)
      .patch(`${accountURL}/2`)
      .set('Authorization', adminToken)
      .send({
        status: "activate",
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('Account is already activated')
        done();
      });
  });
  it('should not deactivate account that is already deactivated', (done) => {
    chai
      .request(app)
      .patch(`${accountURL}/5`)
      .set('Authorization', adminToken)
      .send({
        status: "deactivate",
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('Account is already deactivated')
        done();
      });
  });
  it('should provide correct account update status', (done) => {
    chai
      .request(app)
      .patch(`${accountURL}/3`)
      .set('Authorization', adminToken)
      .send({
        status: "deactivat",
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('Specify correct account status update action');
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
describe('GET /api/v1/accounts?userId=2', () => {
  it('should get all accounts of a specific user', (done) => {
    chai
      .request(app)
      .get(`${accountURL}?userId=2`)
      .set('Authorization', adminToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.success).to.be.equal('true');
        expect(res.body.message).to.be.equal('Accounts retrieved successfully');
        done();
      });
  });
});

describe('GET /api/v1/accounts?email=email3@email.com', () => {
  it('should get specific account of a user', (done) => {
    chai
      .request(app)
      .get(`${accountURL}?email=email3@email.com`)
      .set('Authorization', adminToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.success).to.be.equal('true');
        expect(res.body.message).to.be.equal('Account retrieved successfully');
        done();
      });
  });
});
describe('GET /api/v1/accounts?accountNumber=1002', () => {
  it('should get specific account of a user', (done) => {
    chai
      .request(app)
      .get(`${accountURL}?accountNumber=1002`)
      .set('Authorization', adminToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.success).to.be.equal('true');
        expect(res.body.message).to.be.equal('Account retrieved successfully');
        done();
      });
  });
});
describe('GET /api/v1/accounts?userId=2', () => {
  it('should not get another account for a user', (done) => {
    chai
      .request(app)
      .get(`${accountURL}?userId=2`)
      .set('Authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('Unauthorized');
        done();
      });
  });
});
describe('GET /api/v1/accounts?accountNumber=1002', () => {
  it('should not get another account for a user', (done) => {
    chai
      .request(app)
      .get(`${accountURL}?accountNumber=1002`)
      .set('Authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('Unauthorized');
        done();
      });
  });
});

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
        expect(res.body.message).to.be.equal('Account deleted successfully');
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
        expect(res).to.have.status(400);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('Insufficient balance');
        done();
      });
  });
});
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
        expect(res.body.message).to.be.equal('Account is debited with 5 Naira');
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
        expect(res.body.message).to.be.equal('Account is credited with 5 Naira');
        done();
      });
  });
  it('should not perform a credit transaction if amount less than 0', (done) => {
    chai
      .request(app)
      .post(`${transactionURL}`)
      .set('Authorization', cashierToken)
      .send({
        accountNumber: 1002,
        amount: 0,
        type: 'credit',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('Provide amount greater than 0');
        done();
      });
  });
  it('should not perform a transaction if account number is not in the right format', (done) => {
    chai
      .request(app)
      .post(`${transactionURL}`)
      .set('Authorization', cashierToken)
      .send({
        accountNumber: '10e02',
        amount: 0,
        type: 'credit',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('Enter a valid Account Number');
        done();
      });
  });
  it('should not perform a transaction if amount is not specified', (done) => {
    chai
      .request(app)
      .post(`${transactionURL}`)
      .set('Authorization', cashierToken)
      .send({
        accountNumber: 1002,
        type: 'debit',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('Provide amount');
        done();
      });
  });
  it('should not perform a transaction if account number is not specified', (done) => {
    chai
      .request(app)
      .post(`${transactionURL}`)
      .set('Authorization', cashierToken)
      .send({
        amount: 5,
        type: 'debit',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('Account Number is required');
        done();
      });
  });
  it('should not perform a transaction if transaction type is not specified', (done) => {
    chai
      .request(app)
      .post(`${transactionURL}`)
      .set('Authorization', cashierToken)
      .send({
        accountNumber: 1002,
        amount: 5,
        type: '',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('Specify debit or credit transaction');
        done();
      });
  });
  it('should not perform a transaction if amount is not in numbers', (done) => {
    chai
      .request(app)
      .post(`${transactionURL}`)
      .set('Authorization', cashierToken)
      .send({
        accountNumber: 1002,
        amount: '5b',
        type: 'debit',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('Enter a valid amount');
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
  it('should allow admin to view a specific transactions via its account Number', (done) => {
    chai
    .request(app)
    .get(`${transactionURL}?accountNumber=1002`)
    .set('Authorization', adminToken)
    .end((err, res) => {
      expect(res).to.have.status(200);
      expect(res.body.success).to.be.equal('true');
      // expect(res.body.transactionFound).to.have.key(
      //   'accountNumber',
      //   'balance',
      //   'oldbalance',
      // );
      done();
    });
  });
  //describe('GET /api/v1/transactions/3', () => {
  it('should not allow users to get other users transactions', (done) => {
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
  it('should not allow users to view other users transactions', (done) => {
    chai
      .request(app)
      .get(`${transactionURL}?accountNumber=1002`)
      .set('Authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('Unauthorized');
        done();
      });
  });
});
describe('GET /api/v1/transactions/2', () => {
  it('should allow users to view own transactions with userId', (done) => {
    chai
    .request(app)
    .get(`${transactionURL}?userId=6`)
    .set('Authorization', userToken)
    .end((err, res) => {
      expect(res).to.have.status(404);
      expect(res.body.success).to.be.equal('false');
      expect(res.body.error).to.be.equal('No transaction found');
      // expect(res.body.transactionFound).to.have.key(
      //   'accountNumber',
      //   'balance',
      //   'oldbalance',
      // );
      done();
    });
  });
  //});
  // describe('GET /api/v1/transactions?email=email3@email.com', () => {
  it('should allow users to view own transactions with email', (done) => {
    chai
      .request(app)
      .get(`${transactionURL}?email=email12@email.com`)
      .set('Authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('No transaction found');
        // expect(res.body.transactionFound).to.have.key(
        //   'accountNumber',
        //   'balance',
        //   'oldbalance',
        // );
        done();
      });
  });
  it('should not allow users to view other transactions with email', (done) => {
    chai
      .request(app)
      .get(`${transactionURL}?email=email2@email.com`)
      .set('Authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('Unauthorized');
        // expect(res.body.transactionFound).to.have.key(
        //   'accountNumber',
        //   'balance',
        //   'oldbalance',
        // );
        done();
      });
  });
  //describe('GET /api/v1/transactions?userId=6', () => {
  it('should not allow users to view other users transactions with userId', (done) => {
    chai
      .request(app)
      .get(`${transactionURL}?userId=3`)
      .set('Authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('Unauthorized');
        done();
      });
  });
  it('should allow cashier to view other users transactions with account number', (done) => {
    chai
      .request(app)
      .get(`${transactionURL}?accountNumber=1001`)
      .set('Authorization', cashierToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.success).to.be.equal('true');
        expect(res.body.message).to.be.equal('Transactions retrieved successfully');
        done();
      });
  });
  //describe('GET /api/v1/transactions', () => {
  it('should  allow cashier to view all transactions', (done) => {
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
  //describe('GET /api/v1/transactions?email=name3@email.com', () => {
  it('should allow cashier user to view all transactions of a specific user with email', (done) => {
    chai
      .request(app)
      .get(`${transactionURL}?email=email2@email.com`)
      .set('Authorization', cashierToken)
      .send({
        data: { type: 'cashier' },
      })
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
  //describe('GET /api/v1/transactions', () => {
  it('should allow admin to view all transactions', (done) => {
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
describe('GET /api/v1/transactions?email=name2@email.com', () => {
  it('should  allow admin to view all transactions of a specific user with email', (done) => {
    chai
      .request(app)
      .get(`${transactionURL}?email=email3@email.com`)
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
  it('should  allow admin to view all transactions of a specific user with userId', (done) => {
    chai
      .request(app)
      .get(`${transactionURL}?userId=2`)
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
   it('should not return transaction that does not exist', (done) => {
    chai
      .request(app)
      .get(`${transactionURL}/3000`)
      .set('Authorization', cashierToken)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('No transaction found');
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