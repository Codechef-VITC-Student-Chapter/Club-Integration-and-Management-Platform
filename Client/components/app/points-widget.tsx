"use client";

import React from "react";
import { TrendingUp, Clock, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface CircularProgressProps {
  totalPoints: number;
  pendingPoints: number;
  maxPoints?: number;
  size?: number;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  totalPoints,
  pendingPoints,
  maxPoints = 100,
  size = 120,
}) => {
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const completedPercentage = Math.min((totalPoints / maxPoints) * 100, 100);
  const pendingPercentage = Math.min((pendingPoints / maxPoints) * 100, 100);

  const completedDash = (completedPercentage / 100) * circumference;
  const pendingDash = (pendingPercentage / 100) * circumference;

  return (
    <div className="relative flex justify-center items-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="stroke-muted"
          fill="none"
          strokeWidth="8"
          strokeDasharray={`${circumference} ${circumference}`}
        />

        {/* Pending points circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="stroke-yellow-500 transition-all duration-500 ease-in-out"
          fill="none"
          strokeWidth="8"
          strokeDasharray={`${pendingDash} ${circumference}`}
          strokeDashoffset={-completedDash}
          strokeLinecap="round"
        />

        {/* Completed points circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="stroke-green-500 transition-all duration-500 ease-in-out"
          fill="none"
          strokeWidth="8"
          strokeDasharray={`${completedDash} ${circumference}`}
          strokeDashoffset="0"
          strokeLinecap="round"
        />
      </svg>

      {/* Center content */}
      <div className="absolute flex flex-col items-center justify-center">
        <span className="font-bold text-2xl text-foreground">
          {totalPoints}
        </span>
        <span className="text-xs text-muted-foreground">/ {maxPoints}</span>
      </div>
    </div>
  );
};

interface PointsInfoProps {
  totalPoints: number;
  pendingPoints: number;
  maxPoints?: number;
}

const PointsInfo: React.FC<PointsInfoProps> = ({
  totalPoints,
  pendingPoints,
  maxPoints = 100,
}) => {
  const completionPercentage = Math.round((totalPoints / maxPoints) * 100);

  return (
    <div className="space-y-4">
      {/* Earned Points */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-green-500" />
          <h3 className="font-semibold text-sm text-green-700 dark:text-green-400">
            Points Earned
          </h3>
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-green-600 dark:text-green-400">
              {totalPoints}
            </span>
            <Badge
              variant="secondary"
              className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
            >
              {completionPercentage}%
            </Badge>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </div>
      </div>

      {/* Pending Points */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-yellow-500" />
          <h3 className="font-semibold text-sm text-yellow-700 dark:text-yellow-400">
            Pending Points
          </h3>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
            {pendingPoints}
          </span>
          {pendingPoints > 0 && (
            <Badge
              variant="secondary"
              className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
            >
              Under Review
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

interface PointsWidgetProps {
  clubPoints: Record<string, number>;
  pendingPoints: Record<string, number>;
  maxPoints?: number;
  className?: string;
}

export const PointsWidget: React.FC<PointsWidgetProps> = ({
  clubPoints,
  pendingPoints,
  maxPoints = 100,
  className,
}) => {
  const clubNames = Object.keys(clubPoints);

  if (clubNames.length === 0) {
    return (
      <Card className={cn("w-full max-w-md", className)}>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            No club data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn("w-full max-w-md space-y-4", className)}>
      {clubNames.map((club) => {
        const totalPoints = clubPoints[club] || 0;
        const pendingPointsForClub = pendingPoints[club] || 0;
        const combinedPoints = totalPoints + pendingPointsForClub;

        return (
          <Card
            key={club}
            className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-200"
          >
            <CardHeader className="bg-gradient-to-r from-slate-900 to-slate-700 text-white pb-3">
              <CardTitle className="text-center text-base font-semibold flex items-center justify-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Points Breakdown
              </CardTitle>
              {club !== "default" && (
                <p className="text-center text-sm text-slate-200 capitalize">
                  {club}
                </p>
              )}
            </CardHeader>

            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Circular Progress */}
                <div className="flex-shrink-0">
                  <CircularProgress
                    totalPoints={totalPoints}
                    pendingPoints={pendingPointsForClub}
                    maxPoints={maxPoints}
                    size={140}
                  />
                </div>

                {/* Points Information */}
                <div className="flex-1 w-full">
                  <PointsInfo
                    totalPoints={totalPoints}
                    pendingPoints={pendingPointsForClub}
                    maxPoints={maxPoints}
                  />
                </div>
              </div>

              {/* Summary Stats */}
              <div className="mt-6 pt-4 border-t border-border">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Total Progress:</span>
                  <span className="font-semibold">
                    {combinedPoints} / {maxPoints} points
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
