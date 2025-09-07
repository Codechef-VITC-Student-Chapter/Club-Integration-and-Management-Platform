"use client";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui";
import { Contribution, Status } from "@/types";
import { Calendar, Search, Plus } from "lucide-react";
import { useState } from "react";
import { RequestDialog } from "@/components/app/requests";

export const PendingCompletedRequestsSection = ({
  requests,
  onStatusChange,
  isRequestPage = true,
  showAddPoints = false,
}: {
  requests: Contribution[];
  onStatusChange?: (selectedRequest: Contribution, newStatus: string) => void;
  isRequestPage?: boolean;
  showAddPoints?: boolean;
}) => {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Contribution | null>(
    null
  );

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
    const matchesStatus =
      selectedStatus === "all" ||
      request.status?.toLowerCase() === selectedStatus.toLowerCase();

    const matchesSearch =
      request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.user_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.points.toString().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = async (id: string, newStatus: Status) => {
    if (!selectedRequest) return;
    setSelectedRequest({ ...selectedRequest, status: newStatus });
    if (onStatusChange) onStatusChange(selectedRequest, newStatus);
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
              filteredRequests.map((request) => (
                <Card
                  key={request.id}
                  className="border border-gray-200 hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    setSelectedRequest(request);
                    setIsDialogOpen(true);
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between">
                      <div className="flex-1 w-full">
                        <div className="flex gap-4 items-start justify-between">
                          <div className="flex flex-col">
                            <h3 className="font-semibold text-gray-900 mb-1 flex gap-4">
                              {request.title.length < 30
                                ? request.title
                                : request.title.substring(0, 30) + "..."}
                              <Badge className="bg-gray-200 text-gray-800 m-0">
                                {request.department}
                              </Badge>
                            </h3>
                            <p className="text-gray-600 text-sm mb-2">
                              {request.description.length < 30
                                ? request.description
                                : request.description.substring(0, 30) + "..."}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start justify-between space-x-4 text-sm">
                          {isRequestPage ? (
                            <span className="text-gray-700">
                              {request.user_id}
                            </span>
                          ) : (
                            <span className="text-gray-700">
                              <span className="font-bold">Lead: </span>
                              {request.target}
                            </span>
                          )}
                          <div className="flex items-center space-x-2">
                            <Calendar size={14} className="text-gray-400" />
                            <span className="text-gray-600">
                              {formatDate(request.created_at)}
                            </span>
                          </div>
                          <Badge className={getStatusColor(request.status)}>
                            {request.status}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="bg-orange-50 text-orange-700"
                          >
                            {request.points} pts
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="flex justify-center w-full pt-8 text-gray-500">
                <p>No contributions found...</p>
              </div>
            )}
          </div>
        </CardContent>

        {/* Request Details Dialog */}
        <RequestDialog
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
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
