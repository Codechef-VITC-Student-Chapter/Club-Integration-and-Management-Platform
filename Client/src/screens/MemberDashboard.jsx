import React, { useState, useEffect } from 'react';
import PointsWidget from '../components/PointsWidget'; // Assuming PointsWidget is in the same directory
import RecentContributions from '../components/RecentContributions'; // Assuming RecentContributions is in the same directory
import PendingContributions from '../components/PendingContributions'; // Assuming PendingContributions is in the same directory
import { useRunningContext } from '../contexts/RunningContext';
import CCLogo from '../assets/dashboard_cclogo.png';
import ProfileCard, { Badges } from '../components/ProfileCard';
import { useNavigate } from 'react-router-dom';
function MemberDashboard() {
  const { baseURL, currentUser, token, handleError,  badges = ["Member"] } =
    useRunningContext();
  const isAdmin = true
  const navigate = useNavigate()
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
    <div className="w-[100vw] mx-auto p-6 space-y-6 bg-[#e8f1fe]">
      <div className="w-full h-full flex md:flex-row flex-col md:gap-40">
        <div className='w-full md:w-[30%] xl:w-[20%] md:h-[100vh]  flex flex-col text-white my-14 h-[50vh]'>
          <div className='flex md:w-[300px] md:flex-col h-[340px] flex-row md:gap-4 gap-2 w-full md:h-[650px] md:justify-center md:items-center md:mx-[50px] justify-center'>
            <div className=' w-full md:h-[15%] h-full flex-col gap-8 items-center text-center md:block hidden'>
             {isAdmin && <button className=' bg-[#4079DA] p-3 rounded-xl text-center text-md mx-10 mb-5'
             onClick={()=>navigate("/adminview")}>
                Admin View
              </button>}
            </div>
            <div className='md:min-h-[500px] md:flex md:justify-center md:mb-[-40px] '>
              <ProfileCard isAdmin={true} badges={badges} />
            </div>

            <div className='flex-grow md:min-w-[409px]'>
              {/* Add club points div here here */}
              <PointsWidget clubPoints={clubPoints} pendingPoints={pendingPoints} />
              {isAdmin && <div className=' md:hidden bg-[#4079DA] p-3 rounded-xl text-center text-md mx-1 mb-5 my-10 min-w-[50px]'>
                Admin View
              </div>}
            </div>

          </div>
          <div className='bg-[#2E3446] mx-5 rounded-2xl p-3 md:hidden flex justify-start'>
            <Badges badges={badges} />

          </div>

        </div>
        <div className='md:w-[70%] w-full md:h-[100vh] '>
          

          <div className="flex flex-wrap gap-8 bg-white py-9 rounded-[45px] border-2 border-zinc-800">
            <div className="flex-1 flex flex-col mx-3">
              <div className=" bg-[#e8f1fe] shadow-md rounded-[30px] mb-2 border-2 border-[#1a8755] md:w-[64vw] md:h-[400px]">
                <h2 className="text-xl  mb-2 bg-[#1a8755]  rounded-t-[30px] md:px-[90px] px-[30px] p-[5px] text-white">Recent Contributions</h2>
                <div className="  overflow-y-auto h-[400px] overflow-x-scroll md:p-6 p-2">
                  <RecentContributions contributions={contributions} />
                </div>
              </div>
            </div>
            <div className="flex-1 flex flex-col mx-3 relative">
              <div className=" bg-[#e8f1fe] shadow-md rounded-[30px] mb-2 border-2 border-[#ffac32] md:w-[64vw] md:h-[400px]">
                <h2 className="text-xl mb-2 bg-[#ffac32] rounded-t-[30px] md:px-[90px] px-[30px] p-[5px]">Pending Contributions</h2>
                <div className=" overflow-y-auto h-[400px] overflow-x-scroll md:p-6 p-2">
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
