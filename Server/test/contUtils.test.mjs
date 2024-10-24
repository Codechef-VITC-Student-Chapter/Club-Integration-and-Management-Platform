import { expect } from 'chai'; // Corrected import
import { addContribution, getContributionById, updateContributionStatus } from '../src/utils/contUtils.mjs';
import mongoose from 'mongoose';
import sinon from 'sinon';

// Check if the models are already defined
const Contribution = mongoose.models.Contribution || mongoose.model('Contribution', new mongoose.Schema({})); // Define a schema for the mock model
const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({})); // Define a schema for the mock model

describe('Cont Utils', () => {
  let saveStub, findOneStub, findOneAndUpdateStub;

  before(() => {
    // Stubbing the methods for the Contribution model
    saveStub = sinon.stub(Contribution.prototype, 'save');
    findOneStub = sinon.stub(Contribution, 'findOne');
    findOneAndUpdateStub = sinon.stub(Contribution, 'findOneAndUpdate');
  });

  after(() => {
    // Restoring the original methods
    saveStub.restore();
    findOneStub.restore();
    findOneAndUpdateStub.restore();
  });

  it('should add a new contribution', async () => {
    const contributionData = { user: 'UID123', cont_id: 'CID123' };
    saveStub.resolves(contributionData); // Resolve the save stub with the contribution data

    const result = await addContribution(contributionData);
    expect(result).to.have.property('cont_id', 'CID123');
  });

  it('should get a contribution by ID', async () => {
    const contributionData = { cont_id: 'CID123', points: 50 };
    findOneStub.withArgs({ cont_id: 'CID123' }).resolves(contributionData); // Resolve the findOne stub with the contribution data

    const result = await getContributionById('CID123');
    expect(result).to.have.property('points', 50);
  });

  it('should update contribution status', async () => {
    const updatedContribution = { cont_id: 'CID123', status: 'approved' };
    findOneAndUpdateStub.withArgs({ cont_id: 'CID123' }, { status: 'approved' }, { new: true }).resolves(updatedContribution); // Resolve the findOneAndUpdate stub

    const result = await updateContributionStatus('CID123', 'approved');
    expect(result).to.have.property('status', 'approved');
  });
});
