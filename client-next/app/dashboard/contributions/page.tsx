"use client";

import React, { useEffect, useState } from "react";
import { SidebarWrapper } from "@/components/layouts";
import {
  OverviewCard,
  PointsBreakdownCard,
  ContributionsSection,
} from "@/components/app/contributions";
import { useGetUserContributionsQuery } from "@/lib/redux/api";
import { useSession } from "next-auth/react";

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
  const contributions =
    data?.contributions.map((row) => ({
      ...row.contribution,
      department: row.department_name,
    })) || [];

  // Calculate status counts
  const pendingContributions = contributions.filter(
    (c) => c.status?.toLowerCase() === "pending"
  ).length;
  const approvedContributions = contributions.filter(
    (c) => c.status?.toLowerCase() === "approved"
  ).length;
  const rejectedContributions = contributions.filter(
    (c) => c.status?.toLowerCase() === "rejected"
  ).length;

  return (
    <SidebarWrapper pageTitle="Contributions">
      <div className="h-full w-full">
        <div className="p-6 flex flex-col gap-4 w-full h-full">
          <div className="flex flex-col md:flex-row gap-6 w-full">
            <OverviewCard points={points} contributions={contributions} />
            <PointsBreakdownCard contributions={contributions} />
          </div>
          <div className="overflow-hidden relative h-full w-full">
            <ContributionsSection contributions={contributions} />
          </div>
        </div>
      </div>
    </SidebarWrapper>
  );
}
