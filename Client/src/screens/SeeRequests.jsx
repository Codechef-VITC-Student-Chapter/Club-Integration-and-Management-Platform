import React, { useEffect, useState } from 'react';
import LeadRequests from '../components/LeadRequests';
import { useRunningContext } from '../contexts/RunningContext';

function SeeRequests() {
  const { baseURL, currentUser, token, handleError } = useRunningContext();
  const [requests, setRequests] = useState([]);
  const [done, setDone] = useState([]);
  const [removing, setRemoving] = useState(null);

  useEffect(() => {
    const getMyRequests = async () => {
      const response = await fetch(
        `${baseURL}/userApi/getRequests/${currentUser}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (response.status === 403) {
        handleError('Fetching requests to me', data.error);
        return;
      }

      const pendingRequests = [];
      const completedRequests = [];
      for (let i = 0; i < data.length; i++) {
        if (data[i].status === 'pending') {
          pendingRequests.push(data[i]);
        } else {
          completedRequests.push(data[i]);
        }
      }
      setRequests(pendingRequests);
      setDone(completedRequests);
    };
    getMyRequests();
  }, [baseURL, currentUser, token]);

  const removeRequest = (id, value) => {
    for (let index = 0; index < requests.length; index++) {
      if (requests[index].cont_id === id) {
        const updatedRequest = { ...requests[index], status: value }; // Update status
        setRemoving(index); // Set the request to be removed

        // Update state
        setDone((prevDone) => [...prevDone, updatedRequest]);
        setTimeout(() => {
          setRequests((prevRequests) =>
            prevRequests.filter((_, i) => i !== index)
          );
          setRemoving(null); // Reset the removing state
        }, 300); // Match this duration with the transition duration
      }
    }
  };

  return (
    <>
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-6">Review Requests</h1>
        {requests.map((request, index) => (
          <div
            key={request.cont_id}
            className={`transition-opacity duration-300 ${
              removing === index ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <LeadRequests request={request} remove={removeRequest} />
          </div>
        ))}
      </div>
      <div className="max-w-4xl mt-10 mx-auto p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-6">Completed Requests</h1>
        {done.map((request, index) => (
          <div
            key={request.cont_id}
            className="transition-opacity duration-300 opacity-100"
          >
            <LeadRequests request={request} remove={() => {}} />
          </div>
        ))}
      </div>
    </>
  );
}

export default SeeRequests;
