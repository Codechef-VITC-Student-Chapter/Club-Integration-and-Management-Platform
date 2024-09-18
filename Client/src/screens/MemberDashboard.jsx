import React, { useState, useEffect } from 'react';
import PointsWidget from '../components/PointsWidget'; // Assuming PointsWidget is in the same directory
import RecentContributions from '../components/RecentContributions'; // Assuming RecentContributions is in the same directory
import PendingContributions from '../components/PendingContributions'; // Assuming PendingContributions is in the same directory
import { useRunningContext } from '../contexts/RunningContext';

function MemberDashboard() {
  const { baseURL, currentUser, token, handleError } = useRunningContext();

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
        console.log(data);
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
            donepoints += data[i].points;
            done.push(current);
          }
        }
        setContributions(done);
        setPendingContributions(pending);
        setClubPoints({ codechefvitc: donepoints });
        setPendingPoints({ codechefvitc: pendingpoints });
        console.log(contributions, pendingContributions);
      } catch (error) {
        console.log('Error in fetching contributions: ', error);
      }
    };
    if (currentUser) {
      fetchContributions();
    }
  }, [currentUser]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex justify-between flex-wrap">
        <h1 className="text-3xl font-bold mb-6">Member Dashboard</h1>
        <a href="/requests">
          <button className="px-3 h-8 bg-blue-500 text-white rounded-lg">
            Admin View
          </button>
        </a>
      </div>

      <PointsWidget clubPoints={clubPoints} pendingPoints={pendingPoints} />

      <div className="flex space-x-6">
        <div className="flex-1 flex flex-col">
          <div className="bg-white p-4 shadow-md rounded-lg mb-2">
            <h2 className="text-xl font-bold mb-2">Recent Contributions</h2>
            <div className="h-96 overflow-y-auto">
              <RecentContributions contributions={contributions} />
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col">
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
  );
}

export default MemberDashboard;
