import { expect } from 'chai';
import sinon from 'sinon';
import supertest from 'supertest';
import express from 'express';
import contRouter from '../src/routes/contRouter.mjs'; 
import * as contUtils from '../src/utils/contUtils.mjs';
import { authenticateToken } from '../src/middleware/authenticateToken.mjs';

const app = express();

// Mocking the middleware directly by replacing it in the test environment
app.use(express.json());

// Replace authenticateToken with a mock function in tests
app.use((req, res, next) => {
  req.isLead = true; // Mock lead permission for testing
  next();
});

app.use('/api/cont', contRouter);

describe('Cont Router', () => {
  let addContributionStub, getContributionByIdStub, updateContributionStatusStub;

  before(() => {
    // Stubbing contUtils methods
    addContributionStub = sinon.stub(contUtils, 'addContribution');
    getContributionByIdStub = sinon.stub(contUtils, 'getContributionById');
    updateContributionStatusStub = sinon.stub(contUtils, 'updateContributionStatus');
  });

  after(() => {
    // Restore all stubs
    addContributionStub.restore();
    getContributionByIdStub.restore();
    updateContributionStatusStub.restore();
  });

  describe('POST /add', () => {
    it('should add a new contribution and return it', async () => {
      const contributionData = { user: 'UID123', cont_id: 'CID123456789' };
      addContributionStub.resolves(contributionData); // Stub resolving with data

      const res = await supertest(app)
        .post('/api/cont/add')
        .send({ user: 'UID123' })
        .expect(201);

      expect(res.body).to.have.property('cont_id', 'CID123456789');
      expect(addContributionStub.calledOnce).to.be.true;
    });

    it('should return 400 on error', async () => {
      addContributionStub.rejects(new Error('Failed to add contribution'));

      const res = await supertest(app)
        .post('/api/cont/add')
        .send({ user: 'UID123' })
        .expect(400);

      expect(res.body).to.have.property('error', 'Failed to add contribution');
    });
  });

  describe('GET /points/:id', () => {
    it('should get the points of a contribution by ID', async () => {
      getContributionByIdStub.resolves({ cont_id: 'CID123', points: 50 });

      const res = await supertest(app)
        .get('/api/cont/points/CID123')
        .expect(200);

      expect(res.body).to.equal(50);
      expect(getContributionByIdStub.calledOnce).to.be.true;
    });

    it('should return 404 if contribution is not found', async () => {
      getContributionByIdStub.rejects(new Error('Contribution not found'));

      const res = await supertest(app)
        .get('/api/cont/points/CID123')
        .expect(404);

      expect(res.body).to.have.property('error', 'Contribution not found');
    });
  });

  describe('PATCH /update-status/:id', () => {
    it('should update the contribution status if user is a lead', async () => {
      updateContributionStatusStub.resolves({ cont_id: 'CID123', status: 'approved' });

      const res = await supertest(app)
        .patch('/api/cont/update-status/CID123')
        .send({ status: 'approved' })
        .expect(200);

      expect(res.body).to.have.property('status', 'approved');
      expect(updateContributionStatusStub.calledOnce).to.be.true;
    });

    it('should return 401 if user is not a lead', async () => {
      const mockNonLeadApp = express();
      mockNonLeadApp.use(express.json());
      mockNonLeadApp.use((req, res, next) => {
        req.isLead = false; // Mock non-lead user for testing
        next();
      });
      mockNonLeadApp.use('/api/cont', contRouter);

      const res = await supertest(mockNonLeadApp)
        .patch('/api/cont/update-status/CID123')
        .send({ status: 'approved' })
        .expect(401);

      expect(res.body).to.have.property('error', 'User is not a lead');
    });

    it('should return 400 on error', async () => {
      updateContributionStatusStub.rejects(new Error('Failed to update status'));

      const res = await supertest(app)
        .patch('/api/cont/update-status/CID123')
        .send({ status: 'approved' })
        .expect(400);

      expect(res.body).to.have.property('error', 'Failed to update status');
    });
  });
});
