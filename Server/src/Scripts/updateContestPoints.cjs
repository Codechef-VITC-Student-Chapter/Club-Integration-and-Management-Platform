const fs = require("fs");
const axios = require("axios");
const csv = require("csv-parser");
const inputCsv =
  "C:\\Users\\codew\\Desktop\\Club-Integration-and-Management-Platform\\Server\\src\\DB\\RegNoProfileLink.csv"; // Correct path

const apiUrl = "http://localhost:3000/contApi/update-points"; // Update this with the actual API URL

function extractUsername(url) {
  if (!url) {
    console.log("Error: Profile URL is missing or invalid.");
    return null;
  }

  const regex = /https:\/\/www.codechef.com\/users\/([^/]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

async function getContestPoints(username) {
  const apiUrl = `https://codechef-api.vercel.app/handle/${username}`;
  try {
    const response = await axios.get(apiUrl);
    const data = response.data;
    if (data.success && data.ratingData) {
      const contestsAttended = data.ratingData.length;
      const totalPoints = contestsAttended * 5;
      return { contestsAttended, totalPoints };
    } else {
      return { contestsAttended: 0, totalPoints: 0 };
    }
  } catch (error) {
    console.error(`Error fetching data for ${username}:`, error);
    return { contestsAttended: 0, totalPoints: 0 };
  }
}

async function updatePoints(contId, pointsToAdd) {
  try {
    const response = await axios.post(`${apiUrl}/${contId}`, {
      pointsToAdd,
    });
    console.log(`Updated points for contribution ID ${contId}:`, response.data);
  } catch (error) {
    console.error(
      `Failed to update points for ${contId}:`,
      error.response?.data || error.message
    );
  }
}
async function processCsv() {
  const rowsProcessed = [];
  fs.createReadStream(inputCsv)
    .pipe(csv())
    .on("data", async (row) => {
      const regno = row["RegNo"];
      const profileUrl = row["ProfileLink"];
      const username = extractUsername(profileUrl);

      if (username) {
        const { contestsAttended, totalPoints } = await getContestPoints(
          username
        );
        const result = {
          regno,
          username,
          contestsAttended,
          totalPoints,
        };
        rowsProcessed.push(result);
        console.log(
          `RegNo: ${regno} | Username: ${username} | Contests Attended: ${contestsAttended} | Total Points: ${totalPoints}`
        );

        const contId = `CID${regno}`;
        await updatePoints(contId, totalPoints);
      } else {
        console.log(
          `Invalid profile URL for RegNo: ${regno} | Profile URL: ${profileUrl}`
        );
      }
    })
    .on("end", () => {
      console.log("Processing completed for all rows.");
      console.log("Rows Processed:", rowsProcessed);
    });
}

processCsv();
