"use client";

import React, { useEffect, useState } from "react";
import { SidebarWrapper } from "@/components/layouts";
import { FileText, AlertTriangle } from "lucide-react";
import { useSession } from "next-auth/react";
import {
  useGetLeadUserRequestsQuery,
  useUpdateContributionStatusMutation,
} from "@/lib/redux";
import {
  Contribution,
  ContributionStatusInfo,
  FullContribution,
} from "@/types";
import { PendingCompletedRequestsSection } from "@/components/app";
import { LoadingSpinner } from "@/components/fallbacks";
import { toast } from "sonner";

const RequestsPage = () => {
  const { data: session, status } = useSession();
  const [updateStatus] = useUpdateContributionStatusMutation();
  const [userId, setUserId] = useState("");

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user) return;
    setUserId(session?.user.id);
  }, [session, status]);

  const { data, isLoading, error, refetch } = useGetLeadUserRequestsQuery(
    userId,
    {
      skip: !userId,
    }
  );

  // The backend now returns FullContribution objects directly
  const requests: FullContribution[] = data?.requests || [];

  const getContribution = (fullContrib: FullContribution): Contribution =>
    fullContrib.contribution;

  const pendingRequests = requests.filter(
    (request) => getContribution(request).status === "pending"
  );
  const approvedRequests = requests.filter(
    (request) => getContribution(request).status === "approved"
  );
  const rejectedRequests = requests.filter(
    (request) => getContribution(request).status === "rejected"
  );

  const onStatusChange = async (
    id: string,
    newStatus: string,
    reason?: string
  ) => {
    if (!session || !session.user.id) {
      toast.error("No User found login again");
      return;
    }
    const req: ContributionStatusInfo = {
      cont_id: id,
      lead_user_id: session.user.id,
      status: newStatus,
      reason: reason || "",
    };
    await updateStatus(req);
  };

  if (isLoading) {
    return (
      <SidebarWrapper pageTitle="Requests">
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="flex flex-col items-center gap-4">
            <LoadingSpinner size="lg" />
            <p className="text-sm text-muted-foreground">Loading requests...</p>
          </div>
        </div>
      </SidebarWrapper>
    );
  }

  if (error) {
    if ("status" in error && error.status === 404) {
      return (
        <SidebarWrapper pageTitle="Requests">
          <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-center">
            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
            <div>
              <p className="text-xl font-medium text-muted-foreground mb-2">
                No requests found
              </p>
              <p className="text-sm text-muted-foreground">
                No contribution requests have been submitted yet.
              </p>
            </div>
          </div>
        </SidebarWrapper>
      );
    }

    // General error state
    return (
      <SidebarWrapper pageTitle="Requests">
        <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-center">
          <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
          <div className="max-w-md">
            <p className="text-xl font-medium text-foreground mb-2">
              Unable to load requests
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              There was an error loading the requests data. This could be due to
              a network issue or server problem.
            </p>
          </div>
        </div>
      </SidebarWrapper>
    );
  }

  return (
    <SidebarWrapper pageTitle="Requests">
      <div>
        <div className="px-6 py-2">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <p className="text-gray-600">
                PENDING {pendingRequests.length} · COMPLETED{" "}
                {approvedRequests.length + rejectedRequests.length}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <PendingCompletedRequestsSection
              onStatusChange={onStatusChange}
              requests={requests}
              isRequestPage={true}
            />
          </div>
        </div>
      </div>
    </SidebarWrapper>
  );
};

export default RequestsPage;
