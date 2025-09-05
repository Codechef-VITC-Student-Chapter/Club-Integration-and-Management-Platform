"use client";

import React, { useEffect, useState } from "react";
import SidebarWrapper from "@/components/layouts/sidebar/sidebar-wrapper";
import { Search, Calendar, Plus, Eye, X, Check } from 'lucide-react';
import { useSession } from "next-auth/react";
import { useGetLeadUserRequestsQuery } from "@/lib/redux/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Contribution } from "@/types";
import {PendingCompletedRequestsSection} from "@/components/app/requests";

const RequestsPage = () => {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const { data: session, status } = useSession();

  const [userId, setUserId] = useState("");

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user) return;
      
    setUserId(session?.user.id);
    
  }, [session, status]);

  const { data, isLoading } = useGetLeadUserRequestsQuery(userId);
  const requests: Contribution[] = data?.requests.map((row) => ({...row.contribution, department: row.department_name})) || [];

  // Filter requests based on search term and filters
  const filteredRequests = requests.filter((request) => {
    const matchesSearch = 
      request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'All' || request.status.toLowerCase() === selectedStatus.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  const pendingRequests = filteredRequests.filter((request) => request.status === "pending");
  const completedRequests = filteredRequests.filter((request) => request.status !== "pending");

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedStatus('All');
    setSelectedFilter('All');
  };

  return (
    <SidebarWrapper pageTitle="Requests">
      <div className="bg-gray-50">
        {/* Main Content */}
        <div className="px-6 py-8">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-gray-600">PENDING {pendingRequests.length} · COMPLETED {completedRequests.length}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button className="flex items-center space-x-2 cursor-pointer">
                <Plus size={20} />
                <span>New request</span>
              </Button>
            </div>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4 flex-wrap justify-between">
                <div className="relative flex-1 w-full">
                  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search requests..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex items-center space-x-4">                  
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>                  
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600">My requests</span>
                    <Badge className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center p-0">
                      <span className="text-white text-xs font-bold">{requests.length}</span>
                    </Badge>
                  </div>
                  
                  <Button variant="ghost" onClick={resetFilters} className="text-blue-600 hover:text-blue-700">
                    Reset
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content Grid */}
          {
            <div className="grid grid-cols-2 gap-4">
            {/* Pending Requests */}
            <PendingCompletedRequestsSection pendingRequests={pendingRequests} isPending={true} />

            {/* Completed Requests */}
            <PendingCompletedRequestsSection pendingRequests={completedRequests} isPending={false} />
          </div>
          }
        </div>
      </div>
    </SidebarWrapper>
  );
};

export default RequestsPage;