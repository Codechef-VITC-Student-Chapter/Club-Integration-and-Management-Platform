"use client";

import React, { useState } from "react";
import { User, GitBranch, Calendar } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface TaskComponentProps {
  taskName: string;
  target: string;
  department: string;
  date: string;
  description: string;
  id: string;
  points?: number;
  status: "approved" | "rejected" | "pending";
}

export const TaskComponent: React.FC<TaskComponentProps> = ({
  taskName,
  target,
  department,
  date,
  description,
  id,
  points,
  status,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Status configuration using defined color classes
  const statusConfig = {
    approved: {
      color: "bg-chart-4", // Using positive color (#198754)
      textColor: "text-chart-4",
      badgeVariant: "default" as const,
      badgeClass: "bg-muted text-chart-4 hover:bg-muted/80",
    },
    rejected: {
      color: "bg-destructive", // Using destructive color (#DC3545)
      textColor: "text-destructive",
      badgeVariant: "destructive" as const,
      badgeClass: "bg-muted text-destructive hover:bg-muted/80",
    },
    pending: {
      color: "bg-accent", // Using accent color (#FFAC33)
      textColor: "text-accent-foreground",
      badgeVariant: "secondary" as const,
      badgeClass: "bg-muted text-accent-foreground hover:bg-muted/80",
    },
  };

  const currentStatus = statusConfig[status];

  // Mock rejection reason - in real app this would come from props
  const reason_for_rejection =
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse non, molestias nemo, iure fugiat quis vel ad quidem quo saepe iusto culpa dolore nisi odio asperiores reiciendis omnis hic harum.";

  const displayText =
    status === "rejected" ? reason_for_rejection : description;
  const shouldTruncate = displayText.length > 80;
  const truncatedText = shouldTruncate
    ? displayText.slice(0, 80) + "..."
    : displayText;

  const handleSeeMoreClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Card className="w-full max-w-sm md:min-w-[320px] h-fit shadow-lg hover:shadow-xl transition-all duration-200 relative">
        {/* Header with colored accent */}
        <div className={cn("h-2 w-full rounded-t-lg", currentStatus.color)} />

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-bold truncate pr-2">
                {taskName}
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-1">
                Task ID: {id}
              </CardDescription>
            </div>

            {/* Points Badge */}
            {points !== undefined && (
              <div
                className={cn(
                  "flex items-center justify-center w-12 h-12 rounded-full text-white font-bold text-sm shadow-md",
                  currentStatus.color
                )}
              >
                {points}
              </div>
            )}
          </div>

          {/* Status Badge */}
          <Badge
            variant={currentStatus.badgeVariant}
            className={cn("w-fit capitalize", currentStatus.badgeClass)}
          >
            {status}
          </Badge>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Task Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">Target:</span>
              <span className="text-muted-foreground">{target}</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <GitBranch className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">Department:</span>
              <span className="text-muted-foreground">{department}</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">Date:</span>
              <span className="text-muted-foreground">{date}</span>
            </div>
          </div>

          <Separator />

          {/* Description/Rejection Reason */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm">
              {status === "rejected"
                ? "Reason for Rejection:"
                : "Task Description:"}
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {truncatedText}
              {shouldTruncate && (
                <Button
                  variant="link"
                  className="p-0 h-auto font-medium underline ml-1"
                  onClick={handleSeeMoreClick}
                >
                  See More
                </Button>
              )}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Modal for full description */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <DialogTitle className="text-xl font-bold">
                {taskName}
              </DialogTitle>
              <Badge
                variant={currentStatus.badgeVariant}
                className={cn("capitalize", currentStatus.badgeClass)}
              >
                {status}
              </Badge>
            </div>
            <DialogDescription className="text-muted-foreground">
              Task ID: {id}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Points Display */}
            {points !== undefined && (
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <span className="font-medium">Points:</span>
                <div
                  className={cn(
                    "flex items-center justify-center w-12 h-12 rounded-full text-white font-bold",
                    currentStatus.color
                  )}
                >
                  {points}
                </div>
              </div>
            )}

            {/* Task Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Target:</span>
                </div>
                <p className="text-muted-foreground pl-6">{target}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Department:</span>
                </div>
                <p className="text-muted-foreground pl-6">{department}</p>
              </div>

              <div className="space-y-2 md:col-span-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Date:</span>
                </div>
                <p className="text-muted-foreground pl-6">{date}</p>
              </div>
            </div>

            <Separator />

            {/* Full Description */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">
                {status === "rejected"
                  ? "Reason for Rejection"
                  : "Task Description"}
              </h3>
              <div className="prose prose-sm max-w-none">
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {displayText}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={handleCloseModal}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
