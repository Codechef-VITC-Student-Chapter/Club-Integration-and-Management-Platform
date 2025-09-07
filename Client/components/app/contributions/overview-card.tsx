import { Target, CheckCircle, Clock, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { Contribution } from "@/types";

interface IOverview {
  points: number;
  contributions: Contribution[];
}

export const OverviewCard = ({ points, contributions }: IOverview) => {
  // Calculate metrics
  const totalContributions = contributions.length;
  const totalPoints = points;

  const approvedContributions = contributions.filter(
    (c) => c.status.toLowerCase() === "approved"
  );
  const approvedCount = approvedContributions.length;
  const approvedPoints = approvedContributions.reduce(
    (sum, c) => sum + c.points,
    0
  );

  const pendingContributions = contributions.filter(
    (c) => c.status.toLowerCase() === "pending"
  );
  const pendingCount = pendingContributions.length;
  const pendingPoints = pendingContributions.reduce(
    (sum, c) => sum + c.points,
    0
  );

  const rejectedContributions = contributions.filter(
    (c) => c.status.toLowerCase() === "rejected"
  );
  const rejectedCount = rejectedContributions.length;
  const rejectedPoints = rejectedContributions.reduce(
    (sum, c) => sum + c.points,
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
              <Target className="text-blue-600" size={28} />
              <div>
                <p className="text-sm text-gray-600 mb-1">TOTAL</p>
                <p className="text-lg font-bold">
                  {totalContributions} requests
                </p>
                <p className="text-sm font-semibold text-blue-600">
                  {totalPoints} points
                </p>
              </div>
            </div>
          </Card>

          {/* Approved */}
          <Card className="border-[1px] p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <CheckCircle className="text-green-600" size={28} />
              <div>
                <p className="text-sm text-gray-600 mb-1">APPROVED</p>
                <p className="text-lg font-bold">{approvedCount} requests</p>
                <p className="text-sm font-semibold text-green-600">
                  {approvedPoints} points
                </p>
              </div>
            </div>
          </Card>

          {/* Pending */}
          <Card className="border-[1px] p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <Clock className="text-yellow-600" size={28} />
              <div>
                <p className="text-sm text-gray-600 mb-1">PENDING</p>
                <p className="text-lg font-bold">{pendingCount} requests</p>
                <p className="text-sm font-semibold text-yellow-600">
                  {pendingPoints} points
                </p>
              </div>
            </div>
          </Card>

          {/* Rejected */}
          <Card className="border-[1px] p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <XCircle className="text-red-600" size={28} />
              <div>
                <p className="text-sm text-gray-600 mb-1">REJECTED</p>
                <p className="text-lg font-bold">{rejectedCount} requests</p>
                <p className="text-sm font-semibold text-red-600">
                  {rejectedPoints} points
                </p>
              </div>
            </div>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};
