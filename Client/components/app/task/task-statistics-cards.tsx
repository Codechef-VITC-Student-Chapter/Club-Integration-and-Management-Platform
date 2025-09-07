"use client";

import { Card, CardContent } from "@/components/ui";
import { FullTask } from "@/types";

interface TaskStatisticsCardsProps {
  tasks: FullTask[];
}

export function TaskStatisticsCards({ tasks }: TaskStatisticsCardsProps) {
  const totalTasks = tasks?.length || 0;
  const activeTasks = tasks?.filter((task) => task.task.is_active).length || 0;
  const inactiveTasks =
    tasks?.filter((task) => !task.task.is_active).length || 0;

  return (
    <div className="grid grid-cols-1 gap-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Tasks
              </p>
              <p className="text-2xl font-bold">{totalTasks}</p>
            </div>
            <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
              <div className="h-5 w-5 bg-blue-600 rounded-full"></div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Active Tasks
              </p>
              <p className="text-2xl font-bold text-green-600">{activeTasks}</p>
            </div>
            <div className="h-10 w-10 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
              <div className="h-5 w-5 bg-green-600 rounded-full"></div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Inactive Tasks
              </p>
              <p className="text-2xl font-bold text-red-600">{inactiveTasks}</p>
            </div>
            <div className="h-10 w-10 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
              <div className="h-5 w-5 bg-red-600 rounded-full"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
