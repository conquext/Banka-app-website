import chaiHttp from 'chai-http';
import chai from 'chai';
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
        confirm_password: 'password1'
      })
      .end((err, res) => {
        expect (res).to.have.status(422);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('Please enter your name');
        done();
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
        confirm_password: 'password1'
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
        confirm_password: ''
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
        confirm_password: 'password2'
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
        confirm_password: 'password1'
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


});