import { ListTodo, CheckCircle, Activity, Square } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { FullTask } from "@/types";

interface ITaskOverview {
  tasks: FullTask[];
}

export const TaskOverviewCard = ({ tasks }: ITaskOverview) => {
  // Calculate metrics
  const totalTasks = tasks.length;
  const totalPoints = tasks.reduce(
    (sum, taskData) => sum + taskData.task.points,
    0
  );

  const activeTasks = tasks.filter((taskData) => taskData.task.is_active);
  const activeCount = activeTasks.length;
  const activePoints = activeTasks.reduce(
    (sum, taskData) => sum + taskData.task.points,
    0
  );

  const inactiveTasks = tasks.filter((taskData) => !taskData.task.is_active);
  const inactiveCount = inactiveTasks.length;
  const inactivePoints = inactiveTasks.reduce(
    (sum, taskData) => sum + taskData.task.points,
    0
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {/* Total */}
          <Card className="border-[1px] p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <ListTodo className="text-blue-600" size={28} />
              <div>
                <p className="text-sm text-gray-600 mb-1">TOTAL</p>
                <p className="text-lg font-bold">{totalTasks} tasks</p>
                <p className="text-sm font-semibold text-blue-600">
                  {totalPoints} points
                </p>
              </div>
            </div>
          </Card>

          {/* Active */}
          <Card className="border-[1px] p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <CheckCircle className="text-green-600" size={28} />
              <div>
                <p className="text-sm text-gray-600 mb-1">ACTIVE</p>
                <p className="text-lg font-bold">{activeCount} tasks</p>
                <p className="text-sm font-semibold text-green-600">
                  {activePoints} points
                </p>
              </div>
            </div>
          </Card>

          {/* Inactive */}
          <Card className="border-[1px] p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <Square className="text-red-600" size={28} />
              <div>
                <p className="text-sm text-gray-600 mb-1">INACTIVE</p>
                <p className="text-lg font-bold">{inactiveCount} tasks</p>
                <p className="text-sm font-semibold text-red-600">
                  {inactivePoints} points
                </p>
              </div>
            </div>
          </Card>

          {/* Activity Rate */}
          <Card className="border-[1px] p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <Activity className="text-purple-600" size={28} />
              <div>
                <p className="text-sm text-gray-600 mb-1">ACTIVITY RATE</p>
                <p className="text-lg font-bold">
                  {totalTasks > 0
                    ? Math.round((activeCount / totalTasks) * 100)
                    : 0}
                  %
                </p>
                <p className="text-sm font-semibold text-purple-600">
                  {activeCount}/{totalTasks} active
                </p>
              </div>
            </div>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};
