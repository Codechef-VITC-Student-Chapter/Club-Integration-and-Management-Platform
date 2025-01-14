import React, { useEffect, useState } from "react";
import AdminViewCard from "../components/AdminViewCard";
import dot from "../assets/Admin_view_dot.png";
import tick from "../assets/Admin_view_tick.png";
import file from "../assets/Admin_view_file.png";
import { useRunningContext } from "../contexts/RunningContext";

function AdminView() {
  const [requests, setRequests] = useState([]);
  const { currentUser, token, isAdmin } = useRunningContext();
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_BASE_URL
          }/userApi/get-requests/${currentUser}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch requests");
        const data = await response.json();
        // console.log(data);
        setRequests(data);
      } catch (error) {
        console.error("Error fetching requests: ", error);
      }
    };
    fetchRequests();
  }, []);
  const updateStatus = async (id, newStatus) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/contApi/update-status/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: newStatus,
            is_lead: isAdmin,
          }),
        }
      );
      // console.log(response);
      if (!response.ok) throw new Error("Failed to update request");
      const data = await response.json();
      // console.log(data);
      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.id === id ? { ...request, status: newStatus } : request
        )
      );
    } catch (error) {
      console.error("Error fetching requests: ", error);
    }
  };

  const pendingRequests = requests.filter((req) => req.status === "pending");
  const completedRequests = requests.filter((req) => req.status !== "pending");

  return (
    <div style={{ background: "#E9F1FE", minHeight: "100vh", padding: "40px" }}>
      <div className="flex">
        <img src={file} alt="FileImage" className="h-10" />
        <p className="text-4xl ml-3">Review Request</p>
      </div>

      <div className="mb-4">
        <div className="flex items-center space-x-2 font-semibold mb-4 mt-6">
          <img src={dot} alt="three-dots" />
          <p>Pending Requests</p>
        </div>
        <div className="space-y-4">
          {pendingRequests.length === 0 && (
            <div className="text-xl font-bold text-center">
              No Pending Requests
            </div>
          )}
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
