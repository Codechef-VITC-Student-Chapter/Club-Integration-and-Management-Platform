
import { expect } from 'chai';
import { authenticateToken } from '../src/middleware/authenticateToken.mjs'; 
import sinon from 'sinon';
import { verifyToken } from '../src/utils/jwtUtils.mjs'; 

describe('authenticateToken Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {},
    };
    res = {
      status: sinon.stub().returnsThis(),
      send: sinon.stub(),
      json: sinon.stub(),
    };
    next = sinon.stub();
  });

  it('should call next() if token is valid', async () => {
    const token = 'valid.token.here';
    req.headers.authorization = `Bearer ${token}`;
    const decoded = { id: 'userId', isLead: true };

    // Mock the verifyToken function to return a resolved promise
    sinon.stub(verifyToken, 'default').resolves(decoded);

    await authenticateToken(req, res, next);

    expect(req.user).to.equal(decoded.id);
    expect(req.isLead).to.equal(decoded.isLead);
    expect(next.calledOnce).to.be.true;

    // Restore the stub
    verifyToken.default.restore();
  });

  it('should return 401 if no token is provided', async () => {
    await authenticateToken(req, res, next);

    expect(res.status.calledWith(401)).to.be.true;
    expect(res.send.calledWith('Access Denied')).to.be.true;
    expect(next.notCalled).to.be.true;
  });

  it('should return 403 if token is invalid', async () => {
    const token = 'invalid.token.here';
    req.headers.authorization = `Bearer ${token}`;

    // Mock the verifyToken function to return a rejected promise
    sinon.stub(verifyToken, 'default').rejects(new Error('Invalid Token'));

    await authenticateToken(req, res, next);

    expect(res.status.calledWith(403)).to.be.true;
    expect(res.json.calledWith({ error: 'Invalid Token' })).to.be.true;
    expect(next.notCalled).to.be.true;

    // Restore the stub
    verifyToken.default.restore();
  });
});