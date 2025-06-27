import { useEffect, useState } from "react";
import AdminInboxCard from "./components/AdminInboxCard";
import dot from "./assets/Admin_view_dot.png";
import tick from "./assets/Admin_view_tick.png";
import file from "./assets/Admin_view_file.png";
import { useRunningContext } from "../../contexts/RunningContext";

function AdminInbox() {
  const [requests, setRequests] = useState([]);
  const { baseURL, currentUser, token, isAdmin } = useRunningContext();

  useEffect(() => {
    const fetchRequests = async () => {
      if (!currentUser || !token) return;

      try {
        const response = await fetch(
          `${baseURL}/user/lead/requests/${currentUser}`,
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
        const parsedRequests =
          data.requests?.map((item) => ({
            ...item.contribution,
            clubName: item.club_name,
            departmentName: item.department_name,
          })) || [];
        // console.log(parsedRequests);

        setRequests(parsedRequests);
      } catch (error) {
        console.error("Error fetching requests:", error.message);
      }
    };

    fetchRequests();
  }, [baseURL, currentUser, token]);

  const updateStatus = async (id, newStatus, reason = "") => {
    try {
      const response = await fetch(`${baseURL}/contribution/update/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          cont_id: id,
          lead_user_id: currentUser,
          status: newStatus,
          reason,
        }),
      });

      if (!response.ok) throw new Error("Failed to update request");

      // Update local state after status change
      setRequests((prev) =>
        prev.map((req) =>
          req.id === id ? { ...req, status: newStatus, reason } : req
        )
      );
    } catch (error) {
      console.error("Error updating status:", error.message);
    }
  };

  const pendingRequests =
    requests.filter((req) => req.status === "pending") || [];
  const completedRequests =
    requests.filter((req) => req.status !== "pending") || [];

  return (
    <div className="p-8 min-h-[100vh] bg-[#E9F1FE]">
      <div className="flex mb-4">
        <img src={file} alt="FileImage" className="h-10" />
        <p className="text-4xl ml-3 underline">Requests Inbox</p>
      </div>

      <div className="mb-4 px-4">
        <div className="flex items-center space-x-2 font-semibold mb-4 mt-6 text-2xl">
          <img src={dot} alt="three-dots" />
          <p>Pending Requests</p>
        </div>
        <div className="space-y-4">
          {pendingRequests.length === 0 ? (
            <div className="text-xl font-bold text-center">
              No Pending Requests
            </div>
          ) : (
            pendingRequests.map((request) => (
              <AdminInboxCard
                key={request.id}
                request={request}
                onUpdateStatus={updateStatus}
              />
            ))
          )}
        </div>
      </div>

      <div>
        <div className="flex items-center space-x-2 font-semibold mb-4 text-2xl px-4">
          <img src={tick} alt="tick-mark" />
          <p>Completed Requests</p>
        </div>
        <div className="space-y-4">
          {completedRequests.length === 0 ? (
            <div className="text-xl font-bold text-center">
              No Completed Requests
            </div>
          ) : (
            completedRequests.map((request) => (
              <AdminInboxCard
                key={request.id}
                request={request}
                onUpdateStatus={updateStatus}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminInbox;
