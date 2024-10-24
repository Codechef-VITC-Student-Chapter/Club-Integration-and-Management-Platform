import { expect } from 'chai';
import sinon from 'sinon';
import supertest from 'supertest';
import express from 'express';
import { authenticateToken } from '../src/middleware/authenticateToken.mjs'; 
import { verifyToken } from '../src/utils/jwtUtils.mjs';

const app = express();
app.use(express.json());

// Mock route to test middleware
app.get('/test', authenticateToken, (req, res) => {
  res.status(200).json({ message: 'Access granted' });
});

describe('authenticateToken Middleware', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should call next() if token is valid', async () => {
    const req = {
      headers: { authorization: 'Bearer validToken' },
    };
    const res = {};
    const next = sinon.stub();

    // Mocking verifyToken to simulate valid token
    sandbox.stub(verifyToken, 'verifyToken').resolves({ id: 'UID123', isLead: true });

    await authenticateToken(req, res, next);
    expect(next.calledOnce).to.be.true;
  });

  it('should return 401 if no token is provided', async () => {
    const req = {
      headers: {},
    };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
    const next = sinon.stub();

    await authenticateToken(req, res, next);
    expect(res.status.calledWith(401)).to.be.true;
    expect(res.json.calledWith({ error: 'Access Denied: No token provided' })).to.be.true;
  });

  it('should return 403 if token is invalid', async () => {
    const req = {
      headers: { authorization: 'Bearer invalidToken' },
    };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
    const next = sinon.stub();

    // Mocking verifyToken to simulate invalid token
    sandbox.stub(verifyToken, 'verifyToken').rejects(new Error('Invalid Token'));

    await authenticateToken(req, res, next);
    expect(res.status.calledWith(403)).to.be.true;
    expect(res.json.calledWith({ error: 'Invalid Token' })).to.be.true;
  });
});
