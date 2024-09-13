import express from 'express';
import {
    addContribution,
    removeContribution,
    getContributionById,
    updateContributionStatus
} from '../utils/contUtils.mjs';

const contRouter = express.Router();

contRouter.post('/add', async (req, res) => {
    try {
        const contributionData = req.body;
        const newContribution = await addContribution(contributionData);
        res.status(201).json(newContribution);
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
});

contRouter.get('/points/:id', async (req, res) => {
    try {
        const contId = req.params.id;
        const contribution = await getContributionById(contId);
        res.status(200).json(contribution.points);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

contRouter.delete('/delete/:id', async (req, res) => {
    try {
        const contId = req.params.id;
        const deletedContribution = await removeContribution(contId);
        res.status(200).json(deletedContribution);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

contRouter.get('/get/:id', async (req, res) => {
    try {
        const contId = req.params.id;
        const contribution = await getContributionById(contId);
        res.status(200).json(contribution);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

contRouter.patch('/update-status/:id', async (req, res) => {
    try {
        const contId = req.params.id;
        const { status } = req.body;
        const updatedContribution = await updateContributionStatus(contId, status);
        res.status(200).json(updatedContribution);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

export default contRouter;