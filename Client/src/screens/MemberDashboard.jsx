import React, { useState, useEffect } from 'react';
import PointsWidget from '../components/PointsWidget'; // Assuming PointsWidget is in the same directory
import RecentContributions from '../components/RecentContributions'; // Assuming RecentContributions is in the same directory
import PendingContributions from '../components/PendingContributions'; // Assuming PendingContributions is in the same directory
import { useRunningContext } from '../contexts/RunningContext';
import ProfileCard from '../components/ProfileCard';
import Badge from '../components/Badge';

function MemberDashboard() {
  const { baseURL, currentUser, token, handleError,  badges = ["Member"], isAdmin } =
    useRunningContext();
  const [clubPoints, setClubPoints] = useState({ codechefvitc: 0 });
  const [pendingPoints, setPendingPoints] = useState({ codechefvitc: 0 });
  const [contributions, setContributions] = useState([
    {
      cont_id: "1",
      title: "Task 1",
      target: "User A",
      dep: "Web Dev",
      created_at: "2024-10-01",
      desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime laudantium asperiores itaque fuga illo incidunt quam ipsam repellendus cumque at",
      points: 10,
      status: "accepted"
    },
    {
      cont_id: "2",
      title: "Task 2",
      target: "User B",
      dep: "Web Dev",
      created_at: "2024-10-01",
      desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime laudantium asperiores itaque fuga illo incidunt quam ipsam repellendus cumque at",
      points: 10,
      status: "rejected"
    },{
      cont_id: "1",
      title: "Task 3",
      target: "User C",
      dep: "Web Dev",
      created_at: "2024-10-01",
      desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime laudantium asperiores itaque fuga illo incidunt quam ipsam repellendus cumque at",
      points: 10,
      status: "accepted"
    },]);


  const [pendingContributions, setPendingContributions] = useState([
    {
      cont_id: "1",
      title: "Task 1",
      target: "User A",
      dep: "Web Dev",
      created_at: "2024-10-01",
      desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime laudantium asperiores itaque fuga illo incidunt quam ipsam repellendus cumque at",
      points: 10,
      status: "pending"
    },
    {
      cont_id: "2",
      title: "Task 2",
      target: "User B",
      dep: "Web Dev",
      created_at: "2024-10-01",
      desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime laudantium asperiores itaque fuga illo incidunt quam ipsam repellendus cumque at",
      points: 10,
      status: "pending"
    },{
      cont_id: "1",
      title: "Task 3",
      target: "User C",
      dep: "Web Dev",
      created_at: "2024-10-01",
      desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime laudantium asperiores itaque fuga illo incidunt quam ipsam repellendus cumque at",
      points: 10,
      status: "pending"
    },
  ]);

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        const response = await fetch(`${baseURL}/userApi/get-contribution-data`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user: userDetails._id }),
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
  
  //fetching user details
  useEffect(() => {
    const fetchUser = async (userId) => {
      try {
        const response = await fetch(`${baseURL}/userApi/get/${userId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error fetching user:', errorData.error || 'Unknown error');
          return;
        }
        
        const user = await response.json();
        setUserDetails(user);
      } catch (error) {
        console.error('Error in fetch request:', error);
      }
    };

    if (currentUser) {
      fetchUser(currentUser); // Fetch user data for the current user
    }
  }, [currentUser, baseURL, token]); // Dependencies: refetch when these change
  

  return (    
    <div className="w-[100vw] bg-[#e8f1fe]">
    <div className="w-full h-full flex md:flex-row flex-col">
      <div className='w-full xl:w-[25%] md:w-[30%] h-full overflow-y-scroll'>
        <div className='flex md:flex-col items-center flex-row md:gap-3 w-full md:justify-center md:items-center justify-center md:pb-12 h-full'>
          <div className='md:flex md:justify-center w-full xl:px-10 lg:p-8 md:px-1 px-2'>
            <ProfileCard isAdmin={isAdmin} badges={badges} />
          </div>

          <div className='flex flex-col items-center justify-center md:p-4 pr-6 pt-5 w-full text-white'>
            <PointsWidget clubPoints={clubPoints} pendingPoints={pendingPoints} />
            {isAdmin && <div className=' md:hidden bg-[#4079DA] p-3 rounded-xl text-center text-md mx-1 mb-5 my-10 min-w-[50px]'>
              Admin View
            </div>}
          </div>

        </div>
        <div className='bg-[#2E3446] text-white mx-5 rounded-2xl p-3 md:hidden flex justify-start'>
          <Badge badges={badges} />
        </div>

      </div>
      <div className='xl:w-[75%] md:w-[70%] h-full p-8'>
        <div className="flex flex-col md:h-full gap-8 bg-[#e8f1fe] md:bg-white rounded-[45px] md:border-2 md:border-zinc-800 w-full h-full md:p-6">
          <div className="flex-1 flex flex-col h-full">
            <div className="md:bg-[#e8f1fe] bg-white min-h-[400px] md:min-h-min shadow-md rounded-[30px] border-2 border-[#1a8755] h-[100%]">
              <h2 className="text-xl bg-[#1a8755]  rounded-t-[25px] border-[#1a8755] md:px-[90px] px-[30px] p-[15px] text-white">Recent Contributions</h2>
              <div className="overflow-y-auto p-6 h-full">
                <RecentContributions contributions={contributions} />
              </div>
            </div>
          </div>
          <div className="flex-1 flex flex-col relative h-full">
            <div className=" md:bg-[#e8f1fe] bg-white md:min-h-min min-h-[400px] shadow-md rounded-[30px] border-2 border-[#ffac32] h-full">
              <h2 className="text-xl bg-[#ffac32] rounded-t-[25px] md:px-[90px] px-[30px] p-[15px]">Pending Contributions</h2>
              <div className="p-6 h-full">
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