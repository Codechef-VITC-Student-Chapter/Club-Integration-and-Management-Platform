import React, { useState, useEffect } from 'react';
import PointsWidget from '../components/PointsWidget'; // Assuming PointsWidget is in the same directory
import RecentContributions from '../components/RecentContributions'; // Assuming RecentContributions is in the same directory
import PendingContributions from '../components/PendingContributions'; // Assuming PendingContributions is in the same directory
import { useRunningContext } from '../contexts/RunningContext';
import CCLogo from '../assets/dashboard_cclogo.png';
import ProfileCard, { Badges } from '../components/ProfileCard';

function MemberDashboard() {
  const { baseURL, currentUser, token, handleError, isAdmin, badges = ["Member"] } =
    useRunningContext();

  const [clubPoints, setClubPoints] = useState({ codechefvitc: 0 });
  const [pendingPoints, setPendingPoints] = useState({ codechefvitc: 0 });
  const [contributions, setContributions] = useState([]);
  const [pendingContributions, setPendingContributions] = useState([]);

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        const response = await fetch(`${baseURL}/userAPI/getContributionData`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user: currentUser }),
        });

        const data = await response.json();
        if (response.status == 403) {
          handleError('Fetching contributions', data.error);
          return;
        }
        const done = [];
        const pending = [];
        var donepoints = 0;
        var pendingpoints = 0;
        for (let i = 0; i < data.length; i++) {
          const current = data[i];
          if (current.status == 'pending') {
            pendingpoints += data[i].points;
            pending.push(current);
          } else {
            if (current.status == 'approved') {
              donepoints += data[i].points;
            }
            done.push(current);
          }
        }


        setContributions(done);
        setPendingContributions(pending);
        setClubPoints({ codechefvitc: donepoints });
        setPendingPoints({ codechefvitc: pendingpoints });
      } catch (error) {
        console.log('Error in fetching contributions: ', error);
      }
    };
    if (currentUser) {
      fetchContributions();
    }
  }, [currentUser]);

  return (
    <div className="w-[100vw] mx-auto p-6 space-y-6 bg-[#E9F1FE]">
      <div className="w-full h-full flex md:flex-row flex-col gap-6">
        <div className='w-full md:w-[30%] xl:w-[20%] md:h-[90vh] h-[55vh] flex flex-col gap-5 text-white'>
          <div className='flex md:flex-col flex-row md:gap-10 gap-3 w-full h-full'>
            <div className='relative w-full md:h-[60%] h-full flex-col justify-center items-center text-center overflow-scroll'>
              {isAdmin && <div className='bg-[#4079DA] p-3 rounded-xl text-center text-md mx-10 mb-5 md:block hidden'>
                Admin View
              </div>}
              <ProfileCard isAdmin={true} badges={badges} />
            </div>
            <div className='h-full md:h-[35%] w-full overflow-scroll flex flex-col p-2'>
              <div className='flex-grow'>
                {/* Add club points div here here */}
              </div>
              {isAdmin && <div className='bg-[#4079DA] block md:hidden p-3 rounded-xl text-center text-lg'>
                Admin View
              </div>}
            </div>
          </div>
          <div className='bg-[#2E3446] mx-5 rounded-2xl p-3 md:hidden flex justify-start'>
            <Badges badges={badges} />
          </div>
        </div>
        <div className='md:w-[80%] w-full'>
          <div className="flex justify-between flex-wrap">
            <h1 className="text-3xl font-bold mb-6">Member Dashboard</h1>
            {isAdmin && (
              <a href="/requests">
                <button className="px-3 h-8 bg-blue-500 rounded-lg">
                  Admin View
                </button>
              </a>
            )}
          </div>

          <PointsWidget clubPoints={clubPoints} pendingPoints={pendingPoints} />

          <div className="flex flex-wrap ">
            <div className="flex-1 flex flex-col mx-3">
              <div className="bg-white p-4 shadow-md rounded-lg mb-2">
                <h2 className="text-xl font-bold mb-2">Recent Contributions</h2>
                <div className="h-96 overflow-y-auto">
                  <RecentContributions contributions={contributions} />
                </div>
              </div>
            </div>
            <div className="flex-1 flex flex-col mx-3">
              <div className="bg-white p-4 shadow-md rounded-lg mb-2">
                <h2 className="text-xl font-bold mb-2">Pending Contributions</h2>
                <div className="h-96 overflow-y-auto">
                  <PendingContributions
                    pendingContributions={pendingContributions}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default MemberDashboard;
