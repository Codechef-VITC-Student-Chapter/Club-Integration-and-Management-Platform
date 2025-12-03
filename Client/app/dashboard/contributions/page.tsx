"use client";

import React, { useEffect, useState } from "react";
import { SidebarWrapper } from "@/components/layouts";
import {
  OverviewCard,
  PointsBreakdownCard,
  PendingCompletedRequestsSection,
} from "@/components/app";
import { useGetUserContributionsQuery } from "@/lib/redux";
import { useSession } from "next-auth/react";
import { FullContribution } from "@/types";

export default function ContributionsPage() {
  const { data: session, status } = useSession();
  const [userId, setUserId] = useState("");
  const [points, setPoints] = useState(0);

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user) return;

    setUserId(session?.user.id);
    setPoints(session.user?.total_points);
  }, [session, status]);

  const { data } = useGetUserContributionsQuery(userId);
  // The backend now returns FullContribution objects directly
  const fullContributions: FullContribution[] = data?.contributions || [];

  // Extract contribution data for components that still expect Contribution[]
  const contributions = fullContributions.map((fc) => fc.contribution);

  return (
    <SidebarWrapper pageTitle="Contributions">
      <div className="h-full w-full">
        <div className="p-6 flex flex-col gap-4 w-full h-full">
          <div className="flex flex-col md:flex-row gap-6 w-full">
            <OverviewCard points={points} contributions={contributions} />
            <PointsBreakdownCard contributions={contributions} />
          </div>
          <div className="overflow-hidden relative h-full w-full">
            <PendingCompletedRequestsSection
              requests={fullContributions}
              isRequestPage={false}
              showNewRequest={true}
            />
          </div>
        </div>
      </div>
    </SidebarWrapper>
  );
}
