import { useState, useEffect } from "react";
import PointsWidget from "./components/PointsWidget";
import RecentContributions from "./components/RecentContributions";
import PendingContributions from "./components/PendingContributions";
import { useRunningContext } from "../../contexts/RunningContext";
import ProfileCard from "./components/ProfileCard";
import Badge from "./components/Badge";
import { Coins } from "lucide-react";

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
      setContributions(done);
      setPendingContributions(pending);
      setClubPoints({ codechefvitc: donePoints });
      setPendingPoints({ codechefvitc: pPoints });
    } catch (error) {
      handleError("Error fetching contributions", error.message);
    }
  };

  const fetchUserDetails = async () => {
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

  return (
    <div className="min-h-screen bg-skyblue">
      <div className="flex md:flex-row flex-col h-full md:justify-around">
        <section className="p-2 md:ml-3 flex flex-col xs:flex-row gap-3 xs:justify-center md:flex-col md:pt-2 md:justify-start lg:pt-5">
          <div className="xs:w-full xs:max-w-[300px]">
            <ProfileCard
              badges={badges}
              first_name={userDetails?.first_name}
              last_name={userDetails?.last_name}
              reg_number={userDetails?.reg_number}
            />
          </div>
          <div className="flex flex-col gap-3">
            <PointsWidget
              clubPoints={clubPoints}
              pendingPoints={pendingPoints}
            />
            <div className="bg-secondary text-white rounded-2xl p-3 md:hidden w-full">
              <Badge badges={badges} />
            </div>
          </div>
        </section>
        <main className="xl:w-3/4 md:w-[70%] w-full sm:px-4 sm:pb-4 sm:pt-2 md:pt-2 lg:pt-5">
          <div className="flex flex-col gap-8 bg-skyblue md:bg-white rounded-[45px] md:border-2 md:border-zinc-800 p-2  sm:p-6">
            <section className="flex-1 w-full overflow-hidden">
              <div className="md:bg-skyblue bg-white min-h-[400px] md:min-h-min shadow-md rounded-[30px] border-2 border-positive">
                <h2 className="sm:text-xl text-base bg-positive rounded-t-[25px] px-4 sm:px-[30px] py-[15px] text-white font-semibold flex gap-2 items-center">
                  <Coins size={20} />
                  <span className="truncate">Recent Contributions</span>
                </h2>
                {contributions && (
                  <div className="overflow-x-auto overflow-y-auto p-2 sm:p-6">
                    <RecentContributions contributions={contributions} />
                  </div>
                )}
              </div>
            </section>

            <section className="flex-1 w-full overflow-hidden">
              <div className="md:bg-skyblue bg-white min-h-[400px] md:min-h-min shadow-md rounded-[30px] border-2 border-[#ffac32]">
                <h2 className="text-base sm:text-xl bg-[#ffac32] rounded-t-[25px] px-4 sm:px-[30px] py-[15px] font-semibold flex gap-2 items-center">
                  <Coins size={20} />
                  <span className="truncate">Pending Contributions</span>
                </h2>
                {pendingContributions && (
                  <div className="overflow-x-auto overflow-y-auto p-2 sm:p-6 min-h-[300px]">
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
