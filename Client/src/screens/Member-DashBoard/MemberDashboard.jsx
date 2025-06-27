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
  } = useRunningContext();

  const [userDetails, setUserDetails] = useState(null);
  const [clubPoints, setClubPoints] = useState({ codechefvitc: 0 });
  const [pendingPoints, setPendingPoints] = useState({ codechefvitc: 0 });
  const [contributions, setContributions] = useState([]);
  const [pendingContributions, setPendingContributions] = useState([]);

  const fetchUserDetails = async () => {
    if (!currentUser || !token) return;

    try {
      const response = await fetch(`${baseURL}/user/info/${currentUser}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to fetch user details");
      }

      setUserDetails(data.user);
    } catch (error) {
      handleError("Error fetching user details", error.message);
    }
  };

  const fetchContributions = async () => {
    if (!userDetails?.id || !token) return;

    try {
      const response = await fetch(
        `${baseURL}/user/contributions/${currentUser}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        handleError(
          "Fetching contributions",
          result?.message || "Unknown error"
        );
        return;
      }

      const data = result.contributions || [];
      // console.log(data);
      // Map data into the expected flat format
      const flattened = data.map((item) => ({
        ...item.contribution,
        clubName: item.club_name,
        departmentName: item.department_name,
      }));

      const {
        done,
        pending,
        donePoints,
        pendingPoints: pPoints,
      } = flattened.reduce(
        (acc, curr) => {
          if (curr.status === "pending") {
            acc.pending.push(curr);
            acc.pendingPoints += curr.points;
          } else {
            acc.done.push(curr);
            if (curr.status === "approved") {
              acc.donePoints += curr.points;
            }
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

  useEffect(() => {
    fetchUserDetails();
  }, [currentUser]);

  useEffect(() => {
    if (userDetails) fetchContributions();
  }, [userDetails]);

  return (
    <div className="min-h-screen bg-skyblue">
      <div className="flex md:flex-row flex-col h-full md:justify-around">
        {/* Sidebar Section */}
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

        {/* Main Section */}
        <main className="xl:w-3/4 md:w-[70%] w-full sm:px-4 sm:pb-4 sm:pt-2 md:pt-2 lg:pt-5">
          <div className="flex flex-col gap-8 bg-skyblue md:bg-white rounded-[45px] md:border-2 md:border-zinc-800 p-2 sm:p-6">
            {/* Recent Contributions */}
            <section className="flex-1 w-full overflow-hidden">
              <div className="md:bg-skyblue bg-white min-h-[400px] md:min-h-min shadow-md rounded-[30px] border-2 border-positive">
                <h2 className="sm:text-xl text-base bg-positive rounded-t-[25px] px-4 sm:px-[30px] py-[15px] text-white font-semibold flex gap-2 items-center">
                  <Coins size={20} />
                  <span className="truncate">Recent Contributions</span>
                </h2>
                <div className="overflow-x-auto overflow-y-auto p-2 sm:p-6 max-h-[300px] md:max-h-full">
                  <RecentContributions contributions={contributions || []} />
                </div>
              </div>
            </section>

            {/* Pending Contributions */}
            <section className="flex-1 w-full overflow-hidden">
              <div className="md:bg-skyblue bg-white min-h-[400px] md:min-h-min shadow-md rounded-[30px] border-2 border-[#ffac32]">
                <h2 className="text-base sm:text-xl bg-[#ffac32] rounded-t-[25px] px-4 sm:px-[30px] py-[15px] font-semibold flex gap-2 items-center">
                  <Coins size={20} />
                  <span className="truncate">Pending Contributions</span>
                </h2>
                <div className="overflow-x-auto overflow-y-auto p-2 sm:p-6 min-h-[300px]">
                  <PendingContributions
                    pendingContributions={pendingContributions || []}
                  />
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

export default MemberDashboard;
