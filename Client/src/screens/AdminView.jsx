import React, { useState } from 'react';
import AdminViewCard from '../components/AdminViewCard';
import dot from '../assets/Admin_view_dot.png';
import tick from '../assets/Admin_view_tick.png';
import file from '../assets/Admin_view_file.png';

function AdminView() {
  const [requests, setRequests] = useState([
    { id: 1, status: "default", heading: "Backend And Hosting For Flappy Chef", infotext: "Made the complete backend for Flappy Chef and assisted the department lead in hosting the same.", link: 'https://example.com/', dept: "web", userid: 1, points_requested: 50 },
    { id: 2, status: "default", heading: "Backend And Hosting For Flappy Chef", infotext: "Made the complete backend for Flappy Chef and assisted the department lead in hosting the same.", link: 'https://example.com/', dept: "web", userid: 2, points_requested: 50 },
    { id: 3, status: "default", heading: "Backend And Hosting For Flappy Chef", infotext: "Made the complete backend for Flappy Chef and assisted the department lead in hosting the same.", link: 'https://example.com/', dept: "web", userid: 3, points_requested: 50 },
  ]);

  const updateStatus = (id, newStatus) => {
    setRequests((prevRequests) =>
      prevRequests.map((request) =>
        request.id === id ? { ...request, status: newStatus } : request
      )
    );
  };

  const pendingRequests = requests.filter((req) => req.status === "default");
  const completedRequests = requests.filter((req) => req.status !== "default");

  return (
    <div style={{ background: '#E9F1FE', minHeight: '100vh', padding: '40px' }}>
      <div className='flex'>
        <img src={file} alt="FileImage" className='h-10'/>
        <p className='text-4xl ml-3'>Review Request</p>
      </div>
      
      <div className="mb-4">
        <div className="flex items-center space-x-2 font-semibold mb-4 mt-6">
          <img src={dot} alt="three-dots" />
          <p>Pending Requests</p>
        </div>
        <div className="space-y-4">
          {pendingRequests.map((request) => (
            <AdminViewCard
              key={request.id}
              request={request}
              onUpdateStatus={updateStatus}
            />
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center space-x-2 font-semibold mb-4">
          <img src={tick} alt="tick-mark" />
          <p>Completed Requests</p>
        </div>
        <div className="space-y-4">
          {completedRequests.map((request) => (
            <AdminViewCard
              key={request.id}
              request={request}
              onUpdateStatus={updateStatus}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminView;
