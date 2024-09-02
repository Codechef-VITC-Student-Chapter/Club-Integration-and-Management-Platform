import React, { useState, useEffect } from 'react';
import PointsWidget from '../components/PointsWidget'; // Assuming PointsWidget is in the same directory
import RecentContributions from '../components/RecentContributions'; // Assuming RecentContributions is in the same directory
import PendingContributions from '../components/PendingContributions'; // Assuming PendingContributions is in the same directory

function MemberDashboard() {
  const [clubPoints, setClubPoints] = useState({});
  const [pendingPoints, setPendingPoints] = useState({});
  const [contributions, setContributions] = useState([]);
  const [pendingContributions, setPendingContributions] = useState([]);

  useEffect(() => {
    const fetchMemberData = async () => {
      setTimeout(() => {
        setClubPoints({
          'This is an example for earning points': 45,
          'This is another example': 30,
          'CodeChef VITC': 60,
        });

        setPendingPoints({
          'This is an example for earning points': 5,
          'This is another example': 15,
        });

        setContributions([
          {
            title: 'Organized Event A',
            date: '2024-08-10',
            description: 'Description of event A.',
            club: 'Club 1',
            department: 'Department 1',
            lead: 'Lead 1',
          },
          {
            title: 'Volunteered for Event B',
            date: '2024-07-22',
            description: 'Description of event B.',
            club: 'Club 2',
            department: 'Department 2',
            lead: 'Lead 2',
          },
          {
            title: 'Created Resource C',
            date: '2024-06-15',
            description: 'Description of resource C.',
            club: 'Club 1',
            department: 'Department 1',
            lead: 'Lead 1',
          },
          {
            title: 'Contributed to Project D',
            date: '2024-05-30',
            description: 'Description of project D.',
            club: 'Club 3',
            department: 'Department 3',
            lead: 'Lead 3',
          },
        ]);

        setPendingContributions([
          {
            title: 'Pending Event E',
            date: '2024-08-14',
            description: 'Description of pending event E.',
            club: 'Club 1',
            department: 'Department 1',
            lead: 'Lead 1',
          },
          {
            title: 'Pending Contribution F',
            date: '2024-08-12',
            description: 'Description of pending contribution F.',
            club: 'Club 2',
            department: 'Department 2',
            lead: 'Lead 2',
          },
        ]);
      }, 1000);
    };

    fetchMemberData();
  }, []);

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
