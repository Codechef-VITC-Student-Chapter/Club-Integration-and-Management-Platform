"use client";

import { Activity } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FullTask } from "@/types/api/task";

interface TaskActivityOverviewProps {
  tasks: FullTask[];
}

export function TaskActivityOverview({ tasks }: TaskActivityOverviewProps) {
  const totalTasks = tasks?.length || 0;
  const activeTasks = tasks?.filter((task) => task.task.is_active).length || 0;
  const activePercentage =
    totalTasks > 0 ? (activeTasks / totalTasks) * 100 : 0;

  const activePoints = tasks
    .filter((task) => task.task.is_active)
    .reduce((sum, c) => sum + c.task.points, 0);
  const totalPoints = tasks.reduce((sum, c) => sum + c.task.points, 0);
  const activePointsPercentage =
    totalPoints > 0 ? (activePoints / totalPoints) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Task Activity Overview
        </CardTitle>
        <CardDescription>
          Distribution of active and inactive tasks
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Active Tasks</span>
            <span className="font-medium">
              {activeTasks} / {totalTasks}
            </span>
          </div>
          <Progress value={activePercentage} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{activePercentage.toFixed(1)}% Active</span>
            <span>{(100 - activePercentage).toFixed(1)}% Inactive</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Active Points</span>
            <span className="font-medium">
              {activePoints} / {totalPoints}
            </span>
          </div>
          <Progress value={activePointsPercentage} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{activePointsPercentage.toFixed(1)}% Active</span>
            <span>{(100 - activePointsPercentage).toFixed(1)}% Inactive</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
