"use client";
import { ProfileCard, DepartmentRadarChart } from "@/components/app";
import {
  Award,
  Layers,
  Loader2,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Target,
  Calendar,
  Trophy,
  Activity,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { SidebarWrapper } from "@/components/layouts";
import {
  useGetUserInfoQuery,
  useGetUserContributionsQuery,
} from "@/lib/redux/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardContribution } from "@/types";
import { Progress } from "@/components/ui/progress";
import { useMemo } from "react";

export default function DashboardPage() {
  const { data: session } = useSession();

  // Fetch user info using Redux RTK Query
  const {
    data: userInfo,
    isLoading: isUserLoading,
    error: userError,
  } = useGetUserInfoQuery(session?.user?.id || "", {
    skip: !session?.user?.id,
  });

  // Fetch user contributions using Redux RTK Query
  const {
    data: contributionsData,
    isLoading: isContributionsLoading,
    error: contributionsError,
  } = useGetUserContributionsQuery(session?.user?.id || "", {
    skip: !session?.user?.id,
  });

  const contributions = contributionsData?.contributions || [];
  const user = userInfo?.user || session?.user;

  // Convert FullContribution to DashboardContribution format for compatibility
  const dashboardContributions: DashboardContribution[] = contributions.map(
    (contrib) => ({
      contribution: {
        id: contrib.contribution.id,
        title: contrib.contribution.title,
        description: contrib.contribution.description,
        user_id: contrib.contribution.user_id,
        department: contrib.contribution.department,
        created_at: contrib.contribution.created_at,
        points: contrib.contribution.points,
        status: contrib.contribution.status,
      },
      club_name: contrib.club_name,
      department_name: contrib.department_name,
    })
  );

  // Calculate metrics
  const metrics = useMemo(() => {
    const approved = dashboardContributions.filter(
      (c) => c.contribution.status === "approved"
    );
    const pending = dashboardContributions.filter(
      (c) => c.contribution.status === "pending"
    );
    const rejected = dashboardContributions.filter(
      (c) => c.contribution.status === "rejected"
    );

    const approvedPoints = approved.reduce(
      (sum, c) => sum + c.contribution.points,
      0
    );
    const pendingPoints = pending.reduce(
      (sum, c) => sum + c.contribution.points,
      0
    );

    const rejectedPoints = rejected.reduce(
      (sum, c) => sum + c.contribution.points,
      0
    );

    // Department-wise breakdown
    const departmentStats = dashboardContributions.reduce((acc, c) => {
      const dept = c.contribution.department;
      if (!acc[dept]) {
        acc[dept] = { total: 0, approved: 0, pending: 0, points: 0 };
      }
      acc[dept].total++;
      if (c.contribution.status === "approved") {
        acc[dept].approved++;
        acc[dept].points += c.contribution.points;
      } else if (c.contribution.status === "pending") {
        acc[dept].pending++;
      }
      return acc;
    }, {} as Record<string, { total: number; approved: number; pending: number; points: number }>);

    // Recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentContributions = dashboardContributions.filter(
      (c) => new Date(c.contribution.created_at) > thirtyDaysAgo
    );

    // Completion rate
    const completionRate =
      dashboardContributions.length > 0
        ? Math.round((approved.length / dashboardContributions.length) * 100)
        : 0;

    // Progress towards milestone
    const currentPoints = user?.total_points || 0;
    const milestoneTarget = 100;
    const hasPassedMilestone = currentPoints >= milestoneTarget;
    const progressToNext = hasPassedMilestone
      ? 100
      : (currentPoints / milestoneTarget) * 100;

    return {
      approved: approved.length,
      pending: pending.length,
      rejected: rejected.length,
      approvedPoints,
      pendingPoints,
      rejectedPoints,
      departmentStats,
      recentContributions: recentContributions.length,
      completionRate,
      milestoneTarget,
      hasPassedMilestone,
      progressToNext,
      totalDepartments: Object.keys(departmentStats).length,
    };
  }, [dashboardContributions, user?.total_points]);

  // Loading state
  if (isUserLoading || isContributionsLoading) {
    return (
      <SidebarWrapper pageTitle="Dashboard">
        <div className="h-full flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading dashboard...</span>
          </div>
        </div>
      </SidebarWrapper>
    );
  }

  // Error state
  if (userError || contributionsError) {
    return (
      <SidebarWrapper pageTitle="Dashboard">
        <div className="h-full flex items-center justify-center">
          <Card className="w-full max-w-md mx-4">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-red-600 mb-2">
                Error Loading Dashboard
              </h2>
              <p className="text-gray-600">
                Failed to load dashboard data. Please try refreshing the page.
              </p>
            </CardContent>
          </Card>
        </div>
      </SidebarWrapper>
    );
  }

  return (
    <SidebarWrapper pageTitle="Dashboard">
      <div className="space-y-6 px-6 pb-6">
        {/* Welcome Section */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.first_name || "User"}!
          </h1>
          <p className="text-gray-600 mt-1">
            Here&apos;s your contribution overview and performance metrics.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Profile & Main Metrics */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card with KPIs */}
            <ProfileCard
              name={
                `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim() ||
                "Loading..."
              }
              isLead={user?.is_lead || false}
              Regno={user?.reg_number || "N/A"}
              avatarUrl={`https://avatar.iran.liara.run/username?username=${user?.first_name}+${user?.last_name}`}
              kpis={[
                {
                  title: "TOTAL POINTS",
                  value: `${user?.total_points || 0}`,
                  icon: <Award className="text-yellow-600" />,
                },
                {
                  title: "CONTRIBUTIONS",
                  value: `${dashboardContributions.length}`,
                  icon: <Layers className="text-blue-600" />,
                },
                {
                  title: "APPROVAL RATE",
                  value: `${metrics.completionRate}%`,
                  icon: <TrendingUp className="text-green-600" />,
                },
                {
                  title: "DEPARTMENTS",
                  value: `${metrics.totalDepartments}`,
                  icon: <Target className="text-purple-600" />,
                },
                {
                  title: "THIS MONTH",
                  value: `${metrics.recentContributions}`,
                  icon: <Calendar className="text-orange-600" />,
                },
                {
                  title: "MILESTONE",
                  value: metrics.hasPassedMilestone
                    ? "PASSED!"
                    : `${metrics.milestoneTarget}`,
                  icon: <Trophy className="text-indigo-600" />,
                },
              ]}
            />

            {/* Progress Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Progress to Milestone
                  {metrics.hasPassedMilestone && (
                    <span className="text-2xl animate-bounce">🎉</span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>{user?.total_points || 0} points</span>
                    <span>{metrics.milestoneTarget} points</span>
                  </div>
                  <Progress value={metrics.progressToNext} className="h-3" />
                  {metrics.hasPassedMilestone ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🎊</span>
                      <p className="text-lg font-bold text-green-600">
                        You have passed the milestone! 🎉
                      </p>
                      <span className="text-xl">🎊</span>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600">
                      {metrics.milestoneTarget - (user?.total_points || 0)}{" "}
                      points until milestone
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
            <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-3">
              <div className="grid grid-cols-1 col-span-1 gap-4 w-full">
                <Card className="border-green-200 w-full">
                  <CardHeader>
                    <CardTitle className="">Approved</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1">
                    <div className="flex gap-2">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                      <p className="text-xl font-bold text-green-600">
                        {metrics.approved} Contributions
                      </p>
                    </div>
                    <p className="text-xl text-gray-500 ml-10">
                      {metrics.approvedPoints} points
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-yellow-200">
                  <CardHeader>
                    <CardTitle className="">Pending</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1">
                    <div className="flex gap-2">
                      <Clock className="h-8 w-8 text-yellow-600" />
                      <p className="text-xl font-bold text-yellow-600">
                        {metrics.pending} Contributions
                      </p>
                    </div>
                    <p className="text-xl text-gray-500 ml-10">
                      {metrics.pendingPoints} points
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-red-200">
                  <CardHeader>
                    <CardTitle className="">Rejected</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1">
                    <div className="flex gap-2">
                      <XCircle className="h-8 w-8 text-red-600" />
                      <p className="text-xl font-bold text-red-600">
                        {metrics.rejected} Contributions
                      </p>
                    </div>
                    <p className="text-xl text-gray-500 ml-10">
                      {metrics.rejectedPoints} points
                    </p>
                  </CardContent>
                </Card>
              </div>
              <div className="col-span-2 w-full">
                <DepartmentRadarChart
                  departmentStats={metrics.departmentStats}
                />
              </div>
            </div>
            {/* Status Overview Cards */}

            {/* Department Performance - Visual Chart */}
          </div>
        </div>
      </div>
    </SidebarWrapper>
  );
}
