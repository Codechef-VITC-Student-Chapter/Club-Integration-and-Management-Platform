"use client";

import React, { useEffect, useState } from "react";
import { SidebarWrapper } from "@/components/layouts";
import { Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import {
  useGetLeadUserRequestsQuery,
  useUpdateContributionStatusMutation,
} from "@/lib/redux";
import { Button } from "@/components/ui";
import { Contribution, ContributionStatusInfo } from "@/types";
import { PendingCompletedRequestsSection } from "@/components/app";

const RequestsPage = () => {
  const { data: session, status } = useSession();
  const [updateStatus] = useUpdateContributionStatusMutation();
  const [userId, setUserId] = useState("");

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user) return;
    setUserId(session?.user.id);
  }, [session, status]);

  const { data } = useGetLeadUserRequestsQuery(userId);
  const requests: Contribution[] =
    data?.requests.map((row) => ({
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
              <Button className="flex items-center space-x-2 cursor-pointer">
                <Plus size={20} />
                <span>New request</span>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <PendingCompletedRequestsSection
              onStatusChange={onStatusChange}
              requests={requests}
            />
          </div>
        </div>
      </div>
    </SidebarWrapper>
  );
};

export default RequestsPage;
