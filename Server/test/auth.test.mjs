import * as chai from 'chai';
import chaiHttp from 'chai-http';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import express from 'express';
import authRouter from '../src/routes/authRouter.mjs';

dotenv.config();
chai.use(chaiHttp);
const { expect } = chai; 
chai.should(); 
const app = express();
app.use(express.json());
app.use('/auth', authRouter);
const request = chai.request(app).keepOpen();

before(async function() {
  this.timeout(10000);
  try {
    await mongoose.connect(process.env.CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to test database');
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
});

after(async () => {
  try {
    request.close();
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error closing database connection:', error);
  }
});

beforeEach(async function() {
  this.timeout(5000);
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.CONNECTION_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
    }
    
    await mongoose.connection.collection('users').deleteMany({});
    console.log('Test database cleared');
  } catch (error) {
    console.error('Error clearing database:', error);
    throw error;
  }
});

describe('Authentication API Tests', () => {
  describe('POST /auth/signup', () => {
    it('should sign up a new user and return a JWT token', (done) => {
      const newUser = {
        regno: '12345',
        firstname: 'fgh',
        lastname: 'asd',
        email: 'asdfgh@example.com',
        password: 'password123'
      };

      request
        .post('/auth/signup')
        .send(newUser)
        .end((err, res) => {
          if (err) return done(err);
          res.should.have.status(200);
          res.body.should.have.property('token');
          done();
        });
    });

    it('should return an error if required fields are missing', (done) => {
      const newUser = {
        regno: '12345',
        firstname: 'qwerty',
        email: 'qwerty@example.com',
        lastname: 'asdfgh',
      };

      request
        .post('/auth/signup')
        .send(newUser)
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      const newUser = {
        regno: '12345',
        firstname: 'Test',
        lastname: 'User',
        email: 'test@example.com',
        password: 'password123'
      };

      return new Promise((resolve, reject) => {
        request
          .post('/auth/signup')
          .send(newUser)
          .end((err, res) => {
            if (err) reject(err);
            else resolve(res);
          });
      });
    });

    it('should log in an existing user and return a JWT token', (done) => {
      const userCredentials = {
        regno: '12345',
        password: 'password123'
      };

      request
        .post('/auth/login')
        .send(userCredentials)
        .end((err, res) => {
          if (err) return done(err);
          res.should.have.status(200);
          res.body.should.have.property('token');
          done();
        });
    });

    it('should return an error for invalid credentials', (done) => {
      const userCredentials = {
        regno: '12345',
        password: 'wrongpassword'
      };

      request
        .post('/auth/login')
        .send(userCredentials)
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });

    it('should return an error for non-existent user', (done) => {
      const userCredentials = {
        regno: '99999',
        password: 'password123'
      };

      request
        .post('/auth/login')
        .send(userCredentials)
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });
});

export { app };
