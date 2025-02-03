import express from 'express';
import { authenticateToken } from '../middleware/authenticateToken.mjs';
import { getContributionById } from '../utils/contUtils.mjs';
import { getClubById } from '../utils/clubUtils.mjs';
import { getDepartmentById } from '../utils/depsUtils.mjs';

import {
  removeUser,
  getUserById,
  addDepartments,
  addClubs,
  updateLead,
  removeDepartments,
  removeClubs,
  addContributions,
  removeContributions,
} from '../utils/userUtils.mjs';

import { addUserToClub } from '../utils/clubUtils.mjs';
import { getRequests } from '../utils/contUtils.mjs';

const userRouter = express.Router();

userRouter.use(authenticateToken);

// Route to delete a user
// userRouter.delete('/delete/:userId', async (req, res) => {
//   try {
//     const userDeleted = await removeUser(req.params.userId);
//     res.status(200).json(userDeleted);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// Route to get user data
userRouter.get('/get/:userId', async (req, res) => {
  try {
    const user = await getUserById(req.params.userId);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to get user requests
userRouter.get('/get-requests/:userId', async (req, res) => {
  try {
    const requests = await getRequests(req.params.userId);
    const answer = [];

    for (const request of requests) {
      // console.log(request.club_id, request.department);
      const club = await getClubById(request.club_id);
      const department = await getDepartmentById(request.department);
      const temp = {
        id: request.id,
        title: request.title,
        points: request.points,
        user_id: request.user_id,
        description: request.description,
        proof_files: request.proof_files,
        target: request.target,
        club_id: request.club_id,
        department: request.department,
        created_at: request.created_at,
        status: request.status,
        club_name: club.name,
        department_name: department.department,
      };
      answer.push(temp);
    }

    res.status(200).json(answer);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

// Route to get user contribution data
userRouter.post('/get-contribution-data', async (req, res) => {
  try {
    // console.log(req.body);
    const user = await getUserById(req.body.user);
    const contributions = user.contributions;
    const contributionData = [];
    // console.log("Got user");

    for (const contributionId of contributions) {
      const contribution = await getContributionById(contributionId);
      // console.log("Got cont");

      const club = await getClubById(contribution.club_id);
      // console.log("Getting Data");
      const department = await getDepartmentById(contribution.department);
      const temp = {
        id: contribution.id,
        title: contribution.title,
        points: contribution.points,
        user: contribution.user_id,
        description: contribution.description,
        proof_files: contribution.proof_files,
        target: contribution.target,
        club: contribution.club_id,
        department: contribution.department,
        status: contribution.status,
        created_at: contribution.created_at,
        club_name: club.name,
        department_name: department.department,
      };
      contributionData.push(temp);
    }
    // console.log(contributionData);

    res.status(200).json(contributionData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

// Route to make user a lead
// userRouter.patch('/make-lead/:userId', async (req, res) => {
//   try {
//     const { clubId } = req.body;
//     const club = await addUserToClub(clubId, req.params.userId);
//     const user = await updateLead(req.params.userId, true);
//     res.status(200).json({ user, club });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// Route to add departments to a user
// userRouter.patch('/add-departments/:userId', async (req, res) => {
//   try {
//     const { departments } = req.body;
//     if (!Array.isArray(departments)) {
//       return res.status(400).json({ error: 'Departments must be an array' });
//     }
//     const user = await addDepartments(req.params.userId, departments);
//     res.status(200).json(user);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// Route to add clubs to a user
// userRouter.patch('/add-clubs/:userId', async (req, res) => {
//   try {
//     const { clubs } = req.body;
//     if (!Array.isArray(clubs)) {
//       return res.status(400).json({ error: 'Clubs must be an array' });
//     }
//     const user = await addClubs(req.params.userId, clubs);
//     res.status(200).json(user);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// Route to remove departments from a user
// userRouter.patch('/remove-departments/:userId', async (req, res) => {
//   try {
//     const { departments } = req.body;
//     if (!Array.isArray(departments)) {
//       return res.status(400).json({ error: 'Departments must be an array' });
//     }
//     const user = await removeDepartments(req.params.userId, departments);
//     res.status(200).json(user);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// Route to remove clubs from a user
// userRouter.patch('/remove-clubs/:userId', async (req, res) => {
//   try {
//     const { clubs } = req.body;
//     if (!Array.isArray(clubs)) {
//       return res.status(400).json({ error: 'Clubs must be an array' });
//     }
//     const user = await removeClubs(req.params.userId, clubs);
//     res.status(200).json(user);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// Route to add contributions to a user
// userRouter.patch('/add-contributions/:userId', async (req, res) => {
//   try {
//     const { contributions } = req.body;
//     if (!Array.isArray(contributions)) {
//       return res.status(400).json({ error: 'Contributions must be an array' });
//     }
//     const user = await addContributions(req.params.userId, contributions);
//     res.status(200).json(user);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// Route to remove contributions from a user
// userRouter.patch('/remove-contributions/:userId', async (req, res) => {
//   try {
//     const { contributions } = req.body;
//     if (!Array.isArray(contributions)) {
//       return res.status(400).json({ error: 'Contributions must be an array' });
//     }
//     const user = await removeContributions(req.params.userId, contributions);
//     res.status(200).json(user);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

export default userRouter;
