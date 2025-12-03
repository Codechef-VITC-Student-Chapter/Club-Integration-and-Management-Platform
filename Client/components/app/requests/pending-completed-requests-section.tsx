"use client";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui";
import { Contribution, Status, FullContribution } from "@/types";
import { Calendar, Search, Plus, FileText } from "lucide-react";
import { useState } from "react";
import { RequestDialog } from "@/components/app/requests";
import Link from "next/link";

export const PendingCompletedRequestsSection = ({
  requests,
  onStatusChange,
  isRequestPage = true,
  showAddPoints = false,
  showNewRequest = false,
}: {
  requests: (Contribution | FullContribution)[];
  onStatusChange?: (id: string, newStatus: string, reason?: string) => void;
  isRequestPage?: boolean;
  showAddPoints?: boolean;
  showNewRequest?: boolean;
}) => {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<
    Contribution | FullContribution | null
  >(null);

  // Helper functions to normalize data access
  const getContribution = (
    request: Contribution | FullContribution
  ): Contribution => {
    return "contribution" in request ? request.contribution : request;
  };

  const getDepartmentName = (
    request: Contribution | FullContribution
  ): string => {
    return "department_name" in request
      ? request.department_name
      : request.department;
  };

  const getUserName = (request: Contribution | FullContribution): string => {
    return "user_name" in request ? request.user_name : request.user_id;
  };

  const getLeadUserNames = (
    request: Contribution | FullContribution
  ): string[] => {
    if ("lead_user_names" in request) {
      return request.lead_user_names;
    }
    // Fallback for Contribution type - return target as single lead
    return [getContribution(request).target];
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filteredRequests = requests.filter((request) => {
    const contribution = getContribution(request);
    const matchesStatus =
      selectedStatus === "all" ||
      contribution.status?.toLowerCase() === selectedStatus.toLowerCase();

    const matchesSearch =
      contribution.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contribution.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      getDepartmentName(request)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      contribution.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getUserName(request).toLowerCase().includes(searchTerm.toLowerCase()) ||
      contribution.points.toString().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = async (
    id: string,
    newStatus: Status,
    reason?: string
  ) => {
    if (onStatusChange) {
      await onStatusChange(id, newStatus, reason);
    }
  };

  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      // Reset selected request when dialog closes
      setSelectedRequest(null);
    }
  };

  return (
    <div className="w-full h-[75vh]">
      <Card className="flex flex-col w-full h-full ">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-semibold">Requests</CardTitle>
          {showAddPoints && (
            <Button size="sm" variant="default">
              <Plus className="h-4 w-4 mr-2" />
              Add Points
            </Button>
          )}
          {showNewRequest && (
            <Link href={"/dashboard/contributions/new"}>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Request
              </Button>
            </Link>
          )}
        </CardHeader>

        <CardContent className="flex flex-col gap-4 flex-1 overflow-auto">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <Tabs value={selectedStatus} onValueChange={setSelectedStatus}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
                <TabsTrigger value="rejected">Rejected</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="relative flex-1 max-w-md w-full">
              <Input
                type="text"
                placeholder="Search requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <Search
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>

          {/* Contributions List */}
          <div className="space-y-4 overflow-auto h-full">
            {filteredRequests.length > 0 ? (
              filteredRequests.map((request) => {
                const contribution = getContribution(request);
                const leadNames = getLeadUserNames(request);

                return (
                  <Card
                    key={contribution.id}
                    className="border border-gray-200 hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      setSelectedRequest(request);
                      setIsDialogOpen(true);
                    }}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-start justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2 text-lg">
                          {contribution.title.length < 30
                            ? contribution.title
                            : contribution.title.substring(0, 30) + "..."}
                        </div>
                        <Badge className="bg-gray-200 text-gray-800">
                          {getDepartmentName(request)}
                        </Badge>
                        <div className="flex items-center space-x-2">
                          <Calendar size={14} className="text-gray-400" />
                          <span className="text-gray-600">
                            {formatDate(contribution.created_at)}
                          </span>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardFooter className="px-6 pb-4 flex items-center justify-between gap-2 text-sm flex-wrap">
                      <div className="flex w-full justify-between flex-wrap">
                        {isRequestPage && (
                          <span className="text-gray-700">
                            <span className="font-bold">Submitted by: </span>
                            {getUserName(request)}
                          </span>
                        )}

                        {leadNames.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            <span className="text-gray-600">Leads: </span>
                            {leadNames.slice(0, 2).map((leadName, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                              >
                                {leadName}
                              </Badge>
                            ))}
                            {leadNames.length > 2 && (
                              <Badge
                                variant="outline"
                                className="text-xs bg-gray-50 text-gray-600"
                              >
                                +{leadNames.length - 2} more
                              </Badge>
                            )}
                          </div>
                        )}
                        <div className="flex gap-2">
                          <Badge
                            className={getStatusColor(contribution.status)}
                          >
                            {contribution.status}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="bg-orange-50 text-orange-700"
                          >
                            {contribution.points} pts
                          </Badge>
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <div>
                  <p className="text-lg font-medium text-muted-foreground">
                    No {isRequestPage ? "Requests" : "Contributions"} found
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {searchTerm || selectedStatus !== "all"
                      ? "Try adjusting your search or filter criteria"
                      : "No contribution requests have been submitted yet"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>

        {/* Request Details Dialog */}
        <RequestDialog
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={handleDialogClose}
          selectedRequest={selectedRequest}
          handleStatusChange={handleStatusChange}
          getStatusColor={getStatusColor}
          formatDate={formatDate}
          isRequestPage={isRequestPage}
        />
      </Card>
    </div>
  );
};
