"use client";

import React, { useEffect, useState } from "react";
import { SidebarWrapper } from "@/components/layouts";
import { Search, Calendar, Plus, Eye, X, Check } from "lucide-react";
import { useSession } from "next-auth/react";
import { useGetLeadUserRequestsQuery } from "@/lib/redux/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Contribution } from "@/types";
import { PendingCompletedRequestsSection } from "@/components/app/requests";

const RequestsPage = () => {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const { data: session, status } = useSession();

  const [userId, setUserId] = useState("");

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user) return;

    setUserId(session?.user.id);
  }, [session, status]);

  const { data, isLoading } = useGetLeadUserRequestsQuery(userId);
  const requests: Contribution[] =
    data?.requests.map((row) => ({
      ...row.contribution,
      department: row.department_name,
    })) || [];

  // Filter requests based on search term and filters
  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.department.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatus === "All" ||
      request.status.toLowerCase() === selectedStatus.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const pendingRequests = filteredRequests.filter(
    (request) => request.status === "pending"
  );
  const completedRequests = filteredRequests.filter(
    (request) => request.status !== "pending"
  );

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedStatus("All");
    setSelectedFilter("All");
  };

  return (
    <SidebarWrapper pageTitle="Requests">
      <div>
        <div className="px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-gray-600">
                PENDING {pendingRequests.length} · COMPLETED{" "}
                {completedRequests.length}
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
            <PendingCompletedRequestsSection requests={requests} />
          </div>
        </div>
      </div>
    </SidebarWrapper>
  );
};

export default RequestsPage;
