import express from 'express';
import {
  addContribution,
  removeContribution,
  getContributionById,
  updateContributionStatus,
} from '../utils/contUtils.mjs';
import { authenticateToken } from '../middleware/authenticateToken.mjs';

const contRouter = express.Router();
contRouter.use(authenticateToken); // Ensure that all routes are protected

// POST /add - Add a new contribution
contRouter.post('/add', async (req, res) => {
  try {
    const contributionData = req.body;
    const timeStamp = Date.now();
    const contributionID = `CID${contributionData.user.slice(3)}${timeStamp}`;
    contributionData.cont_id = contributionID;

    const newContribution = await addContribution(contributionData);
    res.status(201).json(newContribution);
  } catch (error) {
    console.error(error); // Changed to console.error for error logging
    res.status(400).json({ error: error.message });
  }
});

// GET /points/:id - Get points of a contribution by ID
contRouter.get('/points/:id', async (req, res) => {
  try {
    const contId = req.params.id;
    const contribution = await getContributionById(contId);

    // Check if contribution exists before accessing points
    if (!contribution) {
      return res.status(404).json({ error: 'Contribution not found' });
    }

    res.status(200).json({ points: contribution.points });
  } catch (error) {
    console.error(error); // Log the error
    res.status(404).json({ error: error.message });
  }
});

// GET /get/:id - Get a contribution by ID
contRouter.get('/get/:id', async (req, res) => {
  try {
    const contId = req.params.id;
    const contribution = await getContributionById(contId);

    // Check if contribution exists before sending response
    if (!contribution) {
      return res.status(404).json({ error: 'Contribution not found' });
    }

    res.status(200).json(contribution);
  } catch (error) {
    console.error(error); // Log the error
    res.status(404).json({ error: error.message });
  }
});

// PATCH /update-status/:id - Update contribution status
contRouter.patch('/update-status/:id', async (req, res) => {
  try {
    // Check if the user is a lead
    if (req.isLead !== true) {
      return res.status(401).json({ error: 'User is not a lead' });
    }

    const contId = req.params.id;
    const { status } = req.body;

    const updatedContribution = await updateContributionStatus(contId, status);

    // Check if contribution was successfully updated
    if (!updatedContribution) {
      return res.status(404).json({ error: 'Contribution not found or not updated' });
    }

    res.status(200).json(updatedContribution);
  } catch (error) {
    console.error(error); // Log the error
    res.status(400).json({ error: error.message });
  }
});

// Uncomment this block if you want to enable the delete functionality
// contRouter.delete('/delete/:id', async (req, res) => {
//   try {
//     if (req.user !== 'UID' + req.params.id) {
//       return res.status(401).json({ error: 'This is not your contribution' });
//     }
//     const contId = req.params.id;
//     const deletedContribution = await removeContribution(contId);

//     if (!deletedContribution) {
//       return res.status(404).json({ error: 'Contribution not found' });
//     }

//     res.status(200).json(deletedContribution);
//   } catch (error) {
//     console.error(error); // Log the error
//     res.status(404).json({ error: error.message });
//   }
// });

export default contRouter;
