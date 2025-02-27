import express from "express";
import {
  addClub,
  removeClub,
  getClubById,
  addDepartmentToClub,
  removeDepartmentFromClub,
  addUserToClub,
  removeUserFromClub,
  getAllMembersFromClub,
} from "../utils/clubUtils.mjs";

import { getDepartmentById } from "../utils/depsUtils.mjs";
import { getUserById, getUserByReg } from "../utils/userUtils.mjs";

const clubRouter = express.Router();

// clubRouter.post('/add', async (req, res) => {
//     try {
//         const clubData = req.body;
//         const newClub = await addClub(clubData);
//         res.status(201).json(newClub);
//         console.log("Successfully added");
//     } catch (error) {
//         console.log(error);
//         res.status(400).json({ error: error.message });
//     }
// });

// clubRouter.delete('/delete/:id', async (req, res) => {
//     try {
//         const clubId = req.params.id;
//         const deletedClub = await removeClub(clubId);
//         res.status(200).json(deletedClub);
//     } catch (error) {
//         res.status(404).json({ error: error.message });
//     }
// });

clubRouter.get("/get/:id", async (req, res) => {
  try {
    // console.log('Hi ' + req.params.id);

    const clubId = req.params.id;
    const club = await getClubById(clubId);
    // console.log(club);
    res.status(200).json(club);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

clubRouter.get("/get-all-members/:id", async (req, res) => {
  try {
    const clubId = req.params.id;
    const members = await getAllMembersFromClub(clubId);
    // console.log(members);
    return res.json(members).status(200);
  } catch (error) {
    console.log("Error while fetching all members from the club");
    res.status(500).json(error);
  }
});

// clubRouter.post('/add-department', async (req, res) => {
//     try {
//         const { clubId, departmentId } = req.body;
//         const updatedClub = await addDepartmentToClub(clubId, departmentId);
//         res.status(200).json(updatedClub);
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// });

// clubRouter.post('/remove-department', async (req, res) => {
//     try {
//         const { clubId, departmentId } = req.body;
//         const updatedClub = await removeDepartmentFromClub(clubId, departmentId);
//         res.status(200).json(updatedClub);
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// });

clubRouter.post("/get-departments", async (req, res) => {
  try {
    const { clubId } = req.body;
    const club = await getClubById(clubId);
    let departments = [];
    departments = await Promise.all(
      club.departments.map(async (id) => {
        const department = await getDepartmentById(id);
        return { id, name: department.name };
      })
    );
    res.status(200).json(departments);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

// clubRouter.post('/add-lead', async (req, res) => {
//     try {
//         const { clubId, userId } = req.body;
//         const updatedClub = await addUserToClub(clubId, userId);
//         res.status(200).json(updatedClub);
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// });

// clubRouter.post('/remove-lead', async (req, res) => {
//     try {
//         const { clubId, userId } = req.body;
//         const updatedClub = await removeUserFromClub(clubId, userId);
//         res.status(200).json(updatedClub);
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// });

export default clubRouter;
