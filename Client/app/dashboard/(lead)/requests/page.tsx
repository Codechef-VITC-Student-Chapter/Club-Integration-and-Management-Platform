"use client";

import React, { useEffect, useState } from "react";
import { SidebarWrapper } from "@/components/layouts";
import { Plus, FileText } from "lucide-react";
import { useSession } from "next-auth/react";
import {
  useGetLeadUserRequestsQuery,
  useUpdateContributionStatusMutation,
} from "@/lib/redux";
import { Button } from "@/components/ui";
import { Contribution, ContributionStatusInfo } from "@/types";
import { PendingCompletedRequestsSection } from "@/components/app";
import { LoadingSpinner } from "@/components/fallbacks";
import Link from "next/link";

const RequestsPage = () => {
  const { data: session, status } = useSession();
  const [updateStatus] = useUpdateContributionStatusMutation();
  const [userId, setUserId] = useState("");

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user) return;
    setUserId(session?.user.id);
  }, [session, status]);

  const { data, isLoading, error } = useGetLeadUserRequestsQuery(userId, {
    skip: !userId,
  });
  const requests: Contribution[] =
    data?.requests?.map((row) => ({
      ...row.contribution,
      department: row.department_name,
    })) || [];

  const pendingRequests = requests.filter(
    (request) => request.status === "pending"
  );
  const approvedRequests = requests.filter(
    (request) => request.status === "approved"
  );
  const rejectedRequests = requests.filter(
    (request) => request.status === "rejected"
  );

  const onStatusChange = async (
    selectedRequest: Contribution,
    newStatus: string
  ) => {
    const req: ContributionStatusInfo = {
      cont_id: selectedRequest?.id ?? "",
      lead_user_id: session?.user.id ?? "",
      status: newStatus,
      reason: "",
    };
    await updateStatus(req);
  };

  if (isLoading) {
    return (
      <SidebarWrapper pageTitle="Requests">
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </SidebarWrapper>
    );
  }

  if (error) {
    if ("status" in error && error.status === 404) {
      return (
        <SidebarWrapper pageTitle="Requests">
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-muted-foreground">
              No requests found.
            </p>
          </div>
        </SidebarWrapper>
      );
    }
    return (
      <SidebarWrapper pageTitle="Requests">
        <div className="flex items-center justify-center h-64">
          <p className="text-destructive">
            Error loading requests. Please try again.
          </p>
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
            <div className="flex items-center space-x-4">
              <Link href={`/requests/new`}>
                <Button className="flex items-center space-x-2 cursor-pointer">
                  <Plus size={20} />
                  <span>New request</span>
                </Button>
              </Link>
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
