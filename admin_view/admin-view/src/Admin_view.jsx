// Admin_view.js
import React, { useState } from 'react';
import AdminViewCard from './AdminViewCard';
import dot from './assets/Admin_view_dot.png';
import tick from './assets/Admin_view_tick.png';

function Admin_view() {
  // Sample data with initial status for each card
  const [requests, setRequests] = useState([
    { id: 1, status: "default" },
    { id: 2, status: "default" },
    { id: 3, status: "default" },
  ]);

  // Function to update the status of a request
  const updateStatus = (id, newStatus) => {
    setRequests((prevRequests) =>
      prevRequests.map((request) =>
        request.id === id ? { ...request, status: newStatus } : request
      )
    );
  };

  // Filter requests into Pending and Completed based on status
  const pendingRequests = requests.filter((req) => req.status === "default");
  const completedRequests = requests.filter((req) => req.status !== "default");

  return (
    <div>
      {/* Pending Requests Section */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 font-semibold mb-4">
          <img src={dot} alt="three-dots" />
          <p>Pending Requests</p>
        </div>
        <div className="space-y-4">
          {pendingRequests.map((request) => (
            <AdminViewCard
              key={request.id}
              id={request.id}
              status={request.status}
              onUpdateStatus={updateStatus} // Pass status update function
            />
          ))}
        </div>
      </div>

      {/* Completed Requests Section */}
      <div>
        <div className="flex items-center space-x-2 font-semibold mb-4">
          <img src={tick} alt="tick-mark" />
          <p>Completed Requests</p>
        </div>
        <div className="space-y-4">
          {completedRequests.map((request) => (
            <AdminViewCard
              key={request.id}
              id={request.id}
              status={request.status}
              onUpdateStatus={updateStatus}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Admin_view;
