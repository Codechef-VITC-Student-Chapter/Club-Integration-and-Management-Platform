"use client";

import React, { useEffect, useState } from "react";
import { useGetClubLeaderboardQuery } from "@/lib/redux";
import { LeaderboardList, TopScore } from "@/components/app";
import { useSession } from "next-auth/react";
import { SidebarWrapper } from "@/components/layouts";

const LeaderBoardPage = () => {
  const { data: session, status } = useSession();
  const [clubID, setClubID] = useState("");

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user) return;

    const userClubs = session.user?.clubs;
    if (userClubs && Array.isArray(userClubs) && userClubs.length > 0) {
      setClubID(userClubs[0]);
    }
  }, [session, status]);

  const { data: leaderboardData, isLoading } = useGetClubLeaderboardQuery(
    clubID,
    {
      skip: !clubID,
    }
  );

  const topThree = leaderboardData?.data?.slice(0, 3) || [];
  const remainingUsers = leaderboardData?.data?.slice(3) || [];

  return (
    <SidebarWrapper pageTitle="Leaderboard">
      <div className="bg-background">
        <div className="flex h-[calc(100vh-140px)] flex-wrap">
          <div className="w-full md:w-1/2">
            <TopScore topThree={topThree} isLoading={isLoading} />
          </div>

          <div className="w-full md:w-1/2">
            <LeaderboardList
              remainingUsers={remainingUsers}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </SidebarWrapper>
  );
};

export default LeaderBoardPage;
