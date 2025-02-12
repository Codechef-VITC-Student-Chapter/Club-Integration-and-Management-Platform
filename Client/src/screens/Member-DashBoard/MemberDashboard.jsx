import { useState, useEffect } from "react";
import PointsWidget from "./components/PointsWidget";
import RecentContributions from "./components/RecentContributions";
import PendingContributions from "./components/PendingContributions";
import { useRunningContext } from "../../contexts/RunningContext";
import ProfileCard from "./components/ProfileCard";
import Badge from "./components/Badge";

function MemberDashboard() {
  const {
    baseURL,
    currentUser,
    token,
    handleError,
    badges = ["Member"],
    isAdmin,
  } = useRunningContext();

  const [userDetails, setUserDetails] = useState(null);
  const [clubPoints, setClubPoints] = useState({ codechefvitc: 0 });
  const [pendingPoints, setPendingPoints] = useState({ codechefvitc: 0 });
  const [contributions, setContributions] = useState([]);
  const [pendingContributions, setPendingContributions] = useState([]);

  const fetchContributions = async () => {
    // console.log(userDetails);
    if (!userDetails?.id) return;

    try {
      const response = await fetch(`${baseURL}/userApi/get-contribution-data`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user: userDetails.id }),
      });

      const data = await response.json();
      // console.log(data);
      if (response.status === 403) {
        handleError("Fetching contributions", data.error);
        return;
      }

      const {
        done,
        pending,
        donePoints,
        pendingPoints: pPoints,
      } = data.reduce(
        (acc, curr) => {
          if (curr.status === "pending") {
            acc.pendingPoints += curr.points;
            acc.pending.push(curr);
          } else {
            if (curr.status === "approved") {
              acc.donePoints += curr.points;
            }
            acc.done.push(curr);
          }
          return acc;
        },
        { done: [], pending: [], donePoints: 0, pendingPoints: 0 }
      );
      // console.log(donePoints, pPoints);
      // console.log(pending);
      setContributions(done);
      setPendingContributions(pending);
      setClubPoints({ codechefvitc: donePoints });
      setPendingPoints({ codechefvitc: pPoints });
    } catch (error) {
      handleError("Error fetching contributions", error.message);
      // Fallback to mock data on error
      // setContributions(MOCK_CONTRIBUTIONS);
      // setPendingContributions(MOCK_PENDING);
    }
  };

  const fetchUserDetails = async () => {
    // console.log(currentUser);
    if (!currentUser) return;

    try {
      const response = await fetch(`${baseURL}/userApi/get/${currentUser}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch user details");
      }

      const userData = await response.json();
      // console.log(userData);
      setUserDetails(userData);
    } catch (error) {
      handleError("Error fetching user details", error.message);
    }
  };

  useEffect(() => {
    console.log("Fetching User Details");
    fetchUserDetails();
  }, [currentUser, baseURL, token]);

  useEffect(() => {
    if (userDetails) {
      console.log("Fetching User Contributions");
      fetchContributions();
    }
  }, [userDetails]);
  // console.log(isAdmin);
  // console.log();

  return (
    <div className="min-h-screen bg-[#e8f1fe]">
      <div className="flex md:flex-row flex-col h-full">
        <aside className="w-full xl:w-1/4 md:w-[30%]">
          <div className="flex md:flex-col flex-row md:gap-3 items-center justify-center md:pb-12">
            <div className="md:w-full xl:px-10 lg: md:px-1 px-2 flex items-center flex-col">
              <ProfileCard
                isAdmin={isAdmin}
                badges={badges}
                first_name={userDetails?.first_name}
                last_name={userDetails?.last_name}
                reg_number={userDetails?.reg_number}
              />
            </div>

            <div className="flex flex-col items-center md:p-4 w-2/3 md:w-full">
              <PointsWidget
                clubPoints={clubPoints}
                pendingPoints={pendingPoints}
              />
            </div>
          </div>
          <div className="bg-[#2E3446] text-white mx-5 rounded-2xl p-3 md:hidden">
            <Badge badges={badges} />
          </div>
        </aside>

        <main className="xl:w-3/4 md:w-[70%] p-8">
          <div className="flex flex-col gap-8 bg-[#e8f1fe] md:bg-white rounded-[45px] md:border-2 md:border-zinc-800 p-6">
            <section className="flex-1">
              <div className="md:bg-[#e8f1fe] bg-white min-h-[400px] md:min-h-min shadow-md rounded-[30px] border-2 border-[#1a8755]">
                <h2 className="text-xl bg-[#1a8755] rounded-t-[25px] md:px-[90px] px-[30px] py-[15px] text-white font-semibold">
                  Recent Contributions
                </h2>
                {contributions && (
                  <div className="overflow-y-auto p-6">
                    <RecentContributions contributions={contributions} />
                  </div>
                )}
              </div>
            </section>

            <section className="flex-1">
              <div className="md:bg-[#e8f1fe] bg-white min-h-[400px] md:min-h-min shadow-md rounded-[30px] border-2 border-[#ffac32]">
                <h2 className="text-xl bg-[#ffac32] rounded-t-[25px] md:px-[90px] px-[30px] py-[15px] font-semibold">
                  Pending Contributions
                </h2>
                {pendingContributions && (
                  <div className="overflow-y-auto p-6">
                    <PendingContributions
                      pendingContributions={pendingContributions}
                    />
                  </div>
                )}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

export default MemberDashboard;
