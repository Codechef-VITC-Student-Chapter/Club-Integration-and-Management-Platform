"use client";
import ProfileCard from "@/components/app/dashboard/ProfileCard";
import KpiCard from "@/components/app/dashboard/KpiCard";
import PointsBreakdown from "@/components/app/dashboard/PointsBreakDown";
import ContributionsList from "@/components/app/dashboard/ContributionsList";
import PendingContributions from "@/components/app/dashboard/PendingContributions";
// import RecentActivity from "@/components/app/dashboard/RecentActivity";
import { Award, Layers, GitMerge } from 'lucide-react';
import SidebarWrapper from "@/components/layouts/sidebar/sidebar-wrapper";
import { useEffect,useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";
import { ContributionObj, DashboardContribution } from '@/types';
export default function DashboardPage() {
  const { data: session } = useSession();
    const router = useRouter();
  const baseURL = process.env.NEXT_PUBLIC_API_URL || "";
  const token = session?.user?.accessToken || "";
  const currentUser =
    session?.user?.first_name && session?.user?.last_name
      ? `${session.user.first_name}${session.user.last_name}`
      : "Loading....";
  const [contributions, setContributions] = useState<DashboardContribution[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  // Fetch Contributions
 
    useEffect(() => {
      const fetchContributions = async () => {
        if (!baseURL || !token || !session?.user?.id) {
          console.log("Missing baseURL, token, or id");
          return;
        };
        try {
          const response = await fetch(
            `${baseURL}/user/contributions/${session?.user?.id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (!response.ok) throw new Error("Failed to fetch departments");
          const data = await response.json();
          setContributions(data.contributions || []);
        } catch (error) {
          toast.error("Unable to load contributions"); // notify failure
        }
      };
      fetchContributions();
    }, [baseURL, token, session?.user?.id]);
  return (
    <SidebarWrapper pageTitle="Dashboard">
    <div className="min-h-screen bg-gray-50">
      
      <main className="p-4 md:p-8 bg-blue-50">
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left and Center Column */}
          <div className="lg:col-span-2">
            {/* Top Row: Profile and KPIs */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-6">
              <div className="xl:col-span-2">
                <ProfileCard
                name={`${session?.user?.first_name ?? ""} ${session?.user?.last_name ?? ""}`.trim() || "Loading..."}
                isLead={session?.user?.is_lead || false}
                Regno={session?.user?.reg_number || "N/A"}
              />
              </div>
              <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <KpiCard title="POINTS EARNED" value={`${session?.user?.total_points}/100`} icon={<Award className="text-blue-500" />} />
                <KpiCard title="TOTAL CONTRIBUTIONS" value={`${session?.user?.contributions?.length}`} icon={<Layers className="text-purple-500" />} />
                
              </div>
            </div>

            {/* Contributions List */}
            <ContributionsList contributions={Array.isArray(contributions) ? contributions : [contributions]} />
          </div>

          {/* Right Column */}
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                <div className="flex flex-col gap-6">
                    <PointsBreakdown pointsData={session?.user?.total_points??0}/>
                    <div className="sm:hidden lg:block">
                        <PendingContributions contributions={Array.isArray(contributions) ? contributions : [contributions]} />
                        {/* <RecentActivity /> */}
                    </div>
                </div>
                <div className="hidden sm:block lg:hidden">
                    <PendingContributions contributions={Array.isArray(contributions) ? contributions : [contributions]}
                    />
                    {/* <RecentActivity /> */}
                </div>
            </div>
          </div>
        </div>

      </main>
      <footer className="text-xs text-gray-500 p-4 md:p-8 flex justify-between">
        <span>Home / Dashboard</span>
        <a href="/help" className="font-semibold text-blue-600">Need help?</a>
      </footer>
    </div></SidebarWrapper>
  );
}