import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";
import { FullTask } from "@/types/api";

interface ITaskPointsBreakdown {
  tasks: FullTask[];
  maxPoints?: number;
}

export const TaskPointsBreakdownCard = ({
  tasks,
  maxPoints = 100,
}: ITaskPointsBreakdown) => {
  const activeTasks = tasks.filter((taskData) => taskData.task.is_active);
  const inactiveTasks = tasks.filter((taskData) => !taskData.task.is_active);

  // Calculate points for each status
  const activePoints = activeTasks.reduce(
    (sum, taskData) => sum + taskData.task.points,
    0
  );
  const inactivePoints = inactiveTasks.reduce(
    (sum, taskData) => sum + taskData.task.points,
    0
  );
  const totalPoints = activePoints + inactivePoints;

  // Calculate percentages for the progress bar
  const activePercentage =
    totalPoints > 0 ? (activePoints / totalPoints) * 100 : 0;
  const inactivePercentage =
    totalPoints > 0 ? (inactivePoints / totalPoints) * 100 : 0;

  // Calculate circular progress based on active points
  const overallPercentage = (activePoints / maxPoints) * 100;

  // Data for radial chart
  const chartData = [
    {
      name: "points",
      value: overallPercentage,
      fill: "#3b82f6",
    },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Points Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-start gap-4">
        <div className="relative h-24 flex gap-10 items-center w-full">
          <div className="relative">
            <ResponsiveContainer width={96} height={96}>
              <RadialBarChart
                cx={48}
                cy={48}
                innerRadius="70%"
                outerRadius="90%"
                startAngle={0}
                endAngle={(activePoints / totalPoints) * 360}
                data={chartData}
              >
                <RadialBar dataKey="value" cornerRadius={10} fill="#3b82f6" />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold text-blue-600">
                {activePoints}
              </span>
            </div>
          </div>
          <p className="font-bold text-xl w-full">Active Points</p>
        </div>
        <div className="flex-1 w-full">
          {/* Multi-colored Progress Bar */}
          <div className="mt-3">
            <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
              {/* Active section (Green) */}
              <div
                className="absolute left-0 top-0 h-full bg-green-600 transition-all duration-300"
                style={{ width: `${activePercentage}%` }}
              />
              {/* Inactive section (Red) */}
              <div
                className="absolute top-0 h-full bg-red-600 transition-all duration-300"
                style={{
                  left: `${activePercentage}%`,
                  width: `${inactivePercentage}%`,
                }}
              />
            </div>

            {/* Legend */}
            <div className="flex justify-between items-center mt-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                <span className="text-gray-600">
                  Active: {activeTasks.length} tasks
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                <span className="text-gray-600">
                  Inactive: {inactiveTasks.length} tasks
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
