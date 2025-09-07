"use client";

import React, { useState, useMemo } from "react";
import { Search, Users } from "lucide-react";
import { SidebarWrapper } from "@/components/layouts";
import { LoadingSpinner } from "@/components/fallbacks";
import {
  Input,
  Badge,
  Avatar,
  AvatarFallback,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  ChartConfig,
} from "@/components/ui";
import { useGetAllClubMembersQuery } from "@/lib/redux/api";
import { club_id } from "@/lib/keys";
import { useRouter } from "next/navigation";
import { PointsBarChart, PointsPieChart } from "@/components/app";

const MembersPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const router = useRouter();

  // Fetch members from backend
  const { data, isLoading, error } = useGetAllClubMembersQuery(club_id);

  // Chart configuration for points analytics
  const chartConfig = {
    count: {
      label: "Members",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  // Pie chart configuration for individual member points
  const pieChartConfig = {
    points: {
      label: "Points",
    },
  } satisfies ChartConfig;

  // Map API data to UI shape
  const members = useMemo(() => {
    if (!data || !data.members) return [];
    return data.members.map((m) => ({
      id: m.id,
      name: `${m.first_name} ${m.last_name}`,
      department:
        m.departments && m.departments.length > 0 ? m.departments[0] : "",
      registerNumber: m.reg_number,
      points: m.total_points,
      status:
        m.locked_till && new Date(m.locked_till) > new Date()
          ? "Inactive"
          : "Active",
      lastUpdated: m.last_updated
        ? m.last_updated.replace("T", " ").slice(0, 16)
        : "",
      avatar: undefined, // You can add avatar logic if available in API
    }));
  }, [data]);

  // Calculate points distribution analytics
  const pointsAnalytics = useMemo(() => {
    const ranges = {
      "0-25": 0,
      "25-50": 0,
      "50-75": 0,
      "75-100": 0,
      "100+": 0,
    };

    members.forEach((member) => {
      const points = member.points;
      if (points >= 0 && points < 25) ranges["0-25"]++;
      else if (points >= 25 && points < 50) ranges["25-50"]++;
      else if (points >= 50 && points < 75) ranges["50-75"]++;
      else if (points >= 75 && points < 100) ranges["75-100"]++;
      else if (points >= 100) ranges["100+"]++;
    });

    const chartData = Object.entries(ranges).map(([range, count]) => ({
      range,
      count,
    }));

    const totalMembers = members.length;
    const averagePoints =
      totalMembers > 0
        ? Math.round(
            members.reduce((sum, m) => sum + m.points, 0) / totalMembers
          )
        : 0;
    const highPerformers = members.filter((m) => m.points >= 75).length;
    const performanceRate =
      totalMembers > 0 ? Math.round((highPerformers / totalMembers) * 100) : 0;

    return {
      chartData,
      totalMembers,
      averagePoints,
      highPerformers,
      performanceRate,
    };
  }, [members]);

  // Prepare pie chart data for individual member points
  const memberPointsData = useMemo(() => {
    // Get top 8 members by points, group the rest as "Others"
    const sortedMembers = [...members].sort((a, b) => b.points - a.points);
    const topMembers = sortedMembers.slice(0, 8);
    const otherMembers = sortedMembers.slice(8);

    const pieData = topMembers.map((member, index) => ({
      name: member.name,
      points: member.points,
      fill: `var(--chart-${(index % 6) + 1})`,
    }));

    // Add "Others" category if there are more than 8 members
    if (otherMembers.length > 0) {
      const othersPoints = otherMembers.reduce((sum, m) => sum + m.points, 0);
      pieData.push({
        name: `Others (${otherMembers.length})`,
        points: othersPoints,
        fill: "var(--chart-6)",
      });
    }

    return pieData;
  }, [members]);

  const filteredMembers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return members.filter((member) => {
      const matchesSearch =
        q === "" ||
        member.name.toLowerCase().includes(q) ||
        member.registerNumber.toLowerCase().includes(q);
      return matchesSearch;
    });
  }, [members, searchQuery]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedMembers = filteredMembers.slice(startIndex, endIndex);

  // Reset to first page when search changes
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(parseInt(value));
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <SidebarWrapper pageTitle="All Members">
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </SidebarWrapper>
    );
  }

  if (error) {
    return (
      <SidebarWrapper pageTitle="All Members">
        <div className="flex items-center justify-center h-64">
          <p className="text-destructive">
            Error loading members. Please try again.
          </p>
        </div>
      </SidebarWrapper>
    );
  }

  return (
    <SidebarWrapper pageTitle="All Members">
      <div className="min-h-screen bg-gradient-to-br">
        <section className="p-2 sm:p-6 space-y-6">
          {/* Header with Search */}
          <div className="flex gap-2">
            {/* Search Bar */}
            <div className="relative flex-1 bg-white border-2 border-accent text-accent-foreground rounded-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name or registration number..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Members Table */}
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-accent hover:bg-accent">
                  <TableHead>Name</TableHead>
                  <TableHead>Register Number</TableHead>
                  <TableHead className="text-center">Points</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedMembers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12">
                      <div className="flex flex-col items-center gap-3">
                        <Users className="h-12 w-12 text-muted-foreground" />
                        <div>
                          <p className="text-lg font-medium text-muted-foreground">
                            No members found
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Try adjusting your search criteria
                          </p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedMembers.map((member) => (
                    <TableRow
                      key={member.id}
                      className="hover:bg-blue-50/30 cursor-pointer transition-colors"
                      onClick={() =>
                        router.push(`/dashboard/members/${member.id}`)
                      }
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                              {member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{member.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-sm text-muted-foreground">
                          {member.registerNumber}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant="outline"
                          className={`font-semibold ${
                            member.points >= 100
                              ? "border-green-500 text-green-700"
                              : member.points >= 75
                              ? "border-blue-500 text-blue-700"
                              : member.points >= 50
                              ? "border-yellow-500 text-yellow-700"
                              : "border-gray-500 text-gray-700"
                          }`}
                        >
                          {member.points}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {/* Pagination Controls */}
            <div className="w-full flex items-center justify-between px-6 py-4 border-t bg-gray-50/50">
              <div className="w-full flex items-center gap-2 text-sm text-muted-foreground">
                <span>Show</span>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={handleItemsPerPageChange}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
                <div>of {filteredMembers.length} members</div>
              </div>

              <Pagination className="w-full">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) setCurrentPage((prev) => prev - 1);
                      }}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>

                  {/* Render page numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum =
                      Math.max(1, Math.min(totalPages - 4, currentPage - 2)) +
                      i;
                    if (pageNum > totalPages) return null;

                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(pageNum);
                          }}
                          isActive={currentPage === pageNum}
                          className="cursor-pointer"
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  {/* Show ellipsis if there are more pages */}
                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages)
                          setCurrentPage((prev) => prev + 1);
                      }}
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>

          {/* Analytics Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PointsBarChart
              chartConfig={chartConfig}
              pointsAnalytics={pointsAnalytics}
            />
            <PointsPieChart
              chartConfig={pieChartConfig}
              memberPointsData={memberPointsData}
              membersLength={members.length}
            />
          </div>
        </section>
      </div>
    </SidebarWrapper>
  );
};

export default MembersPage;
