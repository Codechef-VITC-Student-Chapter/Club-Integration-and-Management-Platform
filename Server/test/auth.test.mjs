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

const STATUS_CODES = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
};

const testUser = {
  regno: '12345',
  firstname: 'Test',
  lastname: 'User',
  email: 'test@example.com',
  password: 'password123'
};

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
    await mongoose.connection.collection('users').deleteMany({});
    console.log('Test database cleared');
  } catch (error) {
    console.error('Error clearing database:', error);
    throw error;
  }
});

describe('Authentication API Tests', () => {
  describe('POST /auth/signup', () => {
    it('should sign up a new user and return a JWT token', async () => {
      const newUser = {
        ...testUser,
        email: 'asdfgh@example.com',
      };

      const res = await request.post('/auth/signup').send(newUser);
      res.should.have.status(STATUS_CODES.OK);
      res.body.should.have.property('token');
    });

    it('should return an error if required fields are missing', async () => {
      const newUser = {
        regno: '12345',
        firstname: 'qwerty',
        email: 'qwerty@example.com',
        lastname: 'asdfgh',
      };

      const res = await request.post('/auth/signup').send(newUser);
      res.should.have.status(STATUS_CODES.BAD_REQUEST);
    });
  });

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      await request.post('/auth/signup').send(testUser);
    });

    it('should log in an existing user and return a JWT token', async () => {
      const userCredentials = {
        regno: testUser.regno,
        password: testUser.password
      };

      const res = await request.post('/auth/login').send(userCredentials);
      res.should.have.status(STATUS_CODES.OK);
      res.body.should.have.property('token');
    });

    it('should return an error for invalid credentials', async () => {
      const userCredentials = {
        regno: testUser.regno,
        password: 'wrongpassword'
      };

      const res = await request.post('/auth/login').send(userCredentials);
      res.should.have.status(STATUS_CODES.UNAUTHORIZED);
    });

    it('should return an error for non-existent user', async () => {
      const userCredentials = {
        regno: '99999',
        password: testUser.password
      };

      const res = await request.post('/auth/login').send(userCredentials);
      res.should.have.status(STATUS_CODES.NOT_FOUND);
    });
  });
});

export { app };
