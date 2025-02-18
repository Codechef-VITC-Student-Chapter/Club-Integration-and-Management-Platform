import express from "express";
import {
  addContribution,
  removeContribution,
  getContributionById,
  updateContributionStatus,
  getRequests,
} from "../utils/contUtils.mjs";
import { authenticateToken } from "../middleware/authenticateToken.mjs";

const contRouter = express.Router();
contRouter.use(authenticateToken);
// contRouter.use((req, res, next) => {
//   console.log("Hello");
//   next();
// });

contRouter.post("/add", async (req, res) => {
  try {
    const contributionData = req.body;
    // console.log(contributionData);
    const timeStamp = Date.now();
    const contributionId = `CID${contributionData.user_id.slice(
      3
    )}${timeStamp}`;
    contributionData.id = contributionId;
    const newContribution = await addContribution(contributionData);
    res.status(201).json(newContribution);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

contRouter.get("/points/:id", async (req, res) => {
  try {
    const contId = req.params.id;
    const contribution = await getContributionById(contId);
    res.status(200).json(contribution.points);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// contRouter.delete('/delete/:id', async (req, res) => {
//   try {
//     if (req.user != 'UID' + req.params.id) {
//       return res.status(401).json({ error: 'This is not your contribution' });
//     }
//     const contId = req.params.id;
//     const deletedContribution = await removeContribution(contId);
//     res.status(200).json(deletedContribution);
//   } catch (error) {
//     res.status(404).json({ error: error.message });
//   }
// });

contRouter.get("/get/:id", async (req, res) => {
  try {
    const contId = req.params.id;
    const contribution = await getContributionById(contId);
    res.status(200).json(contribution);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});
// New POST route to update points
contRouter.post("/update-points/:id", async (req, res) => {
  try {
    const contId = req.params.id;
    const { pointsToAdd } = req.body; // Points to be added

    // Check if pointsToAdd is provided
    if (typeof pointsToAdd !== "number" || pointsToAdd <= 0) {
      return res.status(400).json({ error: "Invalid points to add" });
    }

    // Find the contribution by ID
    const contribution = await Contribution.findOne({ id: contId });
    if (!contribution) {
      return res.status(404).json({ error: "Contribution not found" });
    }

    // Add points to the existing points
    contribution.points += pointsToAdd;

    // Save the updated contribution
    const updatedContribution = await contribution.save();

    res.status(200).json(updatedContribution);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

contRouter.patch("/update-status/:id", async (req, res) => {
  try {
    // console.log(req.body);
    if (!req.body.is_lead) {
      // console.log("Stoopid");
      return res.status(401).json({ error: "User is not a lead" });
    }
    const contId = req.params.id;
    const { status, reason = "" } = req.body; //added reason
    const updatedContribution = await updateContributionStatus(
      contId,
      status,
      reason
    );
    res.status(200).json(updatedContribution);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});
contRouter.get("/getRequests/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const requests = await getRequests(userId);
    res.status(200).json({ requests });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

export default contRouter;
