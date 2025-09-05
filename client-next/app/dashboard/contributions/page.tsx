"use client"

import React, { useEffect, useState } from 'react';
import { SidebarWrapper } from '@/components/layouts';
import { ProfileCard, OverviewCard, PointsBreakdownCard, ContributionsSection } from '@/components/app/contributions';
import { useGetUserContributionsQuery } from '@/lib/redux/api';
import { useSession } from 'next-auth/react';

export default function ContributionsPage() {
  const { data: session, status } = useSession();
  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const [regNo, setRegNo] = useState("");
  const [role, setRole] = useState("");
  const [points, setPoints] = useState(0);

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user) return;
      
    setUserId(session?.user.id);
    setName(`${session.user.first_name} ${session.user.last_name}`);
    setRegNo(session.user.reg_number);
    setRole(session.user.is_lead ? "Admin" : "Member");
    setPoints(session.user?.total_points);
    
  }, [session, status]);
  
  const { data, isLoading } = useGetUserContributionsQuery(userId);
  const contributions = data?.contributions.map((row) => ({...row.contribution, department: row.department_name})) || [];

  return (
    <SidebarWrapper pageTitle='Contributions'>
      <div className="bg-gray-100 h-full w-full">
        <div className="p-6 flex flex-col gap-4 w-full h-full">
          <div className="flex gap-6 w-full">
            <ProfileCard name={name} regno={regNo} type={role} />
            <OverviewCard points={points} total_contributions={contributions?.length} />
            <PointsBreakdownCard points={points} />
          </div>
          <div className='overflow-hidden relative h-full w-full'>
            <ContributionsSection contributions={contributions} />
          </div>
        </div>
      </div>
    </SidebarWrapper>
  );
}