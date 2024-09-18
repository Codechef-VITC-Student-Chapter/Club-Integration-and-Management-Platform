import express from 'express';
import { authenticateToken } from '../middleware/authenticateToken.mjs';
import { getContributionById } from '../utils/contUtils.mjs';

import { 
    removeUser, 
    getUserById, 
    addDepartments, 
    addClubs, 
    removeDepartments, 
    removeClubs,
    addContributions,
    removeContributions
} from '../utils/userUtils.mjs';

const userRouter = express.Router();

userRouter.use(authenticateToken); 

userRouter.delete('/delete/:userId', async (req, res) => {
    try {
        const userDeleted = await removeUser(req.params.userId);
        res.status(200).json(userDeleted);
    } catch (error) {
        res.status(500).json({ "error": error.message });
    }
});

userRouter.get('/get/:userId', async (req, res) => {
    try {
        const user = await getUserById(req.params.userId);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ "error": error.message });
    }
});

userRouter.post('/getContributionData', async (req, res) => {
    try {
        const user = await getUserById(req.user.user_id);
        const contributions = user.contributions;
        const contributionData = [];
        for (let contributionId of contributions) {
            const contribution = await getContributionById(contributionId);
            contributionData.push(contribution);
        }
        res.status(200).json(contributionData);
    } catch (error) {
        res.status(500).json({ "error": error.message });
    }
});

userRouter.patch('/add-departments/:userId', async (req, res) => {
    try {
        const { departments } = req.body; 
        if (!Array.isArray(departments)) {
            return res.status(400).json({ "error": "Departments must be an array" });
        }
        const user = await addDepartments(req.params.userId, departments);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ "error": error.message });
    }
});

userRouter.patch('/add-clubs/:userId', async (req, res) => {
    try {
        const { clubs } = req.body; 
        if (!Array.isArray(clubs)) {
            return res.status(400).json({ "error": "Clubs must be an array" });
        }
        const user = await addClubs(req.params.userId, clubs);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ "error": error.message });
    }
});

userRouter.patch('/remove-departments/:userId', async (req, res) => {
    try {
        const { departments } = req.body;  
        if (!Array.isArray(departments)) {
            return res.status(400).json({ "error": "Departments must be an array" });
        }
        const user = await removeDepartments(req.params.userId, departments);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ "error": error.message });
    }
});

userRouter.patch('/remove-clubs/:userId', async (req, res) => {
    try {
        const { clubs } = req.body; // Expecting an array of clubs to remove
        if (!Array.isArray(clubs)) {
            return res.status(400).json({ "error": "Clubs must be an array" });
        }
        const user = await removeClubs(req.params.userId, clubs);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ "error": error.message });
    }
});

// New routes for contributions

userRouter.patch('/add-contributions/:userId', async (req, res) => {
    try {
        const { contributions } = req.body; 
        if (!Array.isArray(contributions)) {
            return res.status(400).json({ "error": "Contributions must be an array" });
        }
        const user = await addContributions(req.params.userId, contributions);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ "error": error.message });
    }
});

userRouter.patch('/remove-contributions/:userId', async (req, res) => {
    try {
        const { contributions } = req.body; 
        if (!Array.isArray(contributions)) {
            return res.status(400).json({ "error": "Contributions must be an array" });
        }
        const user = await removeContributions(req.params.userId, contributions);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ "error": error.message });
    }
});

export default userRouter;
