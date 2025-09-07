"use client";

import React, { useEffect } from "react";
import { useGetClubLeaderboardQuery } from "@/lib/redux";
import { LeaderboardList, TopScore } from "@/components/app";
import { useSession } from "next-auth/react";
import { SidebarWrapper } from "@/components/layouts";
import { LoadingSpinner } from "@/components/fallbacks";
import { Trophy, Users } from "lucide-react";
import { club_id } from "@/lib/keys";

const LeaderBoardPage = () => {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user) return;
  }, [session, status]);

  const {
    data: leaderboardData,
    isLoading,
    error,
  } = useGetClubLeaderboardQuery(club_id, {
    skip: !club_id,
  });

  const topThree = leaderboardData?.data?.slice(0, 3) || [];
  const remainingUsers = leaderboardData?.data?.slice(3) || [];

  // Loading state
  if (isLoading) {
    return (
      <SidebarWrapper pageTitle="Leaderboard">
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <LoadingSpinner size="lg" />
        </div>
      </SidebarWrapper>
    );
  }

  // Error state
  if (error) {
    return (
      <SidebarWrapper pageTitle="Leaderboard">
        <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-center">
          <Trophy className="h-16 w-16 text-muted-foreground mb-4" />
          <div>
            <p className="text-xl font-medium text-muted-foreground mb-2">
              Unable to load leaderboard
            </p>
            <p className="text-sm text-muted-foreground">
              There was an error loading the leaderboard data. Please try again
              later.
            </p>
          </div>
        </div>
      </SidebarWrapper>
    );
  }

  // Empty state - no members found
  if (!leaderboardData?.data || leaderboardData.data.length === 0) {
    return (
      <SidebarWrapper pageTitle="Leaderboard">
        <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-center">
          <Users className="h-16 w-16 text-muted-foreground mb-4" />
          <div>
            <p className="text-xl font-medium text-muted-foreground mb-2">
              No members on leaderboard yet
            </p>
            <p className="text-sm text-muted-foreground">
              The leaderboard will show member rankings once contributions are
              made.
            </p>
          </div>
        </div>
      </SidebarWrapper>
    );
  }

  return (
    <SidebarWrapper pageTitle="Leaderboard">
      <div className="bg-background">
        <div className="flex h-[calc(100vh-140px)] flex-wrap">
          <div className="w-full md:w-1/2">
            <TopScore topThree={topThree} isLoading={false} />
          </div>

          <div className="w-full md:w-1/2">
            <LeaderboardList
              remainingUsers={remainingUsers}
              isLoading={false}
            />
          </div>
        </div>
      </div>
    </SidebarWrapper>
  );
};

export default LeaderBoardPage;
