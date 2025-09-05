"use client";

import React, { useState } from "react";
import { Search, ChevronDown, List, Grid, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Contribution } from "@/types";

export const ContributionsSection = ({ contributions }: {contributions: Contribution[]}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedDate, setSelectedDate] = useState("Date");

  const filteredContributions = (contributions ?? []).filter((c: Contribution) => {
    const matchesStatus = selectedStatus === "All" || 
    c.status?.toLowerCase() === selectedStatus.toLowerCase();

    const matchesSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.points.toString() == searchTerm.toLowerCase();

    return matchesStatus && matchesSearch;
  });

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "default";
      case "pending":
        return "secondary";
      case "rejected":
        return "destructive";
      default:
        return "default";
    }
  };

  return (
    <div className="w-full h-[57vh]">
      <Card className="flex flex-col gap-4 p-6 w-full h-full overflow-auto">
        <h2 className="text-xl font-semibold">Contributions</h2>

        {/* Filters */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Status Filter */}
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            {/* Date Filter */}
            <Select value={selectedDate} onValueChange={setSelectedDate}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Date">Date</SelectItem>
                <SelectItem value="This Week">This Week</SelectItem>
                <SelectItem value="This Month">This Month</SelectItem>
                <SelectItem value="This Year">This Year</SelectItem>
              </SelectContent>
            </Select>

            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <Input
                type="text"
                placeholder="Search contributions"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Contributions List */}
        {
          filteredContributions.length === 0 ?
          <div className="flex justify-center w-full pt-8 text-gray-500">
            No contributions found...
          </div> :
          <div className="space-y-4 overflow-auto h-full">
          {filteredContributions.map((c) => (
            <Card
              key={c.id}
              className="border border-gray-200 hover:bg-gray-50"
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">{c.title}</h3>
                    <p className="text-gray-600 text-sm mb-2">{c.description}</p>

                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <span>{c.department}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar size={14} />
                        <span>{new Date(c.created_at).toLocaleDateString()}</span>
                      </div>
                      <Badge 
                        variant={getStatusVariant(c.status)}
                        className={`
                          font-bold text-white
                          ${c.status.toLowerCase() === "approved" && "bg-green-600 hover:bg-green-700"} 
                          ${c.status.toLowerCase() === "pending" && "bg-yellow-600 hover:bg-yellow-700"} 
                          ${c.status.toLowerCase() === "rejected" && "bg-red-600 hover:bg-red-700"} 
                        `}
                      >
                        {c.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Points Badge */}
                  <Badge className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold hover:bg-orange-600">
                    {c.points}
                  </Badge>
                </div>

                {/* Proof files */}
                {c.proof_files?.length! > 0 && (
                  <div className="mt-2 text-xs text-blue-600 underline">
                    {c.proof_files?.map((file, idx) => (
                      <a
                        key={idx}
                        href={file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mr-2"
                      >
                        {file}
                      </a>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        }
      </Card>
    </div>
  );
};