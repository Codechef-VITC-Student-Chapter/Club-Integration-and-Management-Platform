"use client";

import {
  useGetUserContributionsQuery,
  useGetUserInfoQuery,
} from "@/lib/redux/api";
import {
  OverviewCard,
  PointsBreakdownCard,
  PendingCompletedRequestsSection,
} from "@/components/app";
import React, { useMemo } from "react";
import { useParams } from "next/navigation";
import { SidebarWrapper } from "@/components/layouts";
import { LoadingSpinner } from "@/components/fallbacks";
import { FileText } from "lucide-react";

export default function IndividualMemberContributionsPage() {
  const params = useParams();
  const userId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const {
    data: userInfo,
    isLoading: isLoadingUser,
    error: userError,
  } = useGetUserInfoQuery(userId || "", {
    skip: !userId,
  });
  const { data, isLoading, error } = useGetUserContributionsQuery(
    userId || "",
    {
      skip: !userId,
    }
  );

  const contributions = useMemo(
    () =>
      data?.contributions?.map((row) => ({
        ...row.contribution,
        department: row.department_name,
      })) || [],
    [data]
  );
  const memberName = userInfo?.user
    ? `${userInfo.user.first_name} ${userInfo.user.last_name}`
    : "";
  const points = userInfo?.user?.total_points || 0;

  if (isLoading || isLoadingUser) {
    return (
      <SidebarWrapper pageTitle={`${memberName} Contributions`}>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </SidebarWrapper>
    );
  }

  if (userError) {
    if ("status" in userError && userError.status === 404) {
      return (
        <SidebarWrapper pageTitle="Member Not Found">
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-muted-foreground">
              Member not found.
            </p>
          </div>
        </SidebarWrapper>
      );
    }
    return (
      <SidebarWrapper pageTitle="Error">
        <div className="flex items-center justify-center h-64">
          <p className="text-destructive">
            Error loading member information. Please try again.
          </p>
        </div>
      </SidebarWrapper>
    );
  }

  if (error) {
    if ("status" in error && error.status === 404) {
      return (
        <SidebarWrapper pageTitle={`${memberName} Contributions`}>
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-muted-foreground">
              No contributions found for this member.
            </p>
          </div>
        </SidebarWrapper>
      );
    }
    return (
      <SidebarWrapper pageTitle={`${memberName} Contributions`}>
        <div className="flex items-center justify-center h-64">
          <p className="text-destructive">
            Error loading contributions. Please try again.
          </p>
        </div>
      </SidebarWrapper>
    );
  }

  return (
    <SidebarWrapper pageTitle={`${memberName} Contributions`}>
      <div className="p-6 flex flex-col gap-4 w-full h-full">
        <div className="flex flex-col md:flex-row gap-6 w-full">
          <OverviewCard points={points} contributions={contributions} />
          <PointsBreakdownCard contributions={contributions} />
        </div>
        <div className="overflow-hidden relative h-full w-full">
          <PendingCompletedRequestsSection
            requests={contributions}
            isRequestPage={true}
          />
        </div>
      </div>
    </SidebarWrapper>
  );
}
