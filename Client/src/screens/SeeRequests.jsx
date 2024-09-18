import React, { useEffect, useState } from 'react';
import LeadRequests from '../components/LeadRequests';
import { useRunningContext } from '../contexts/RunningContext';

function SeeRequests() {
  const { baseURL, currentUser, token } = useRunningContext();
  const [requests, setRequests] = useState([]);
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
      if (response.status == 403) {
        handleError('Fetching requests to me', data.error);
        return;
      }

      const whatToPut = [];
      for (let i = 0; i < data.length; i++) {
        if (data[i].status == 'pending') {
          whatToPut.push(data[i]);
        }
      }
      setRequests(whatToPut);
    };
    getMyRequests();
  }, []);

  const removeRequest = (index) => {
    setRemoving(index); // Set the request to be removed
    setTimeout(() => {
      setRequests((prevRequests) => prevRequests.filter((_, i) => i !== index));
      setRemoving(null); // Reset the removing state
    }, 300); // Match this duration with the transition duration
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Review Requests</h1>
      {requests.map((request, index) => (
        <div
          key={request.cont_id}
          className={`transition-opacity duration-300 ${
            removing === index ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <LeadRequests request={request} remove={() => removeRequest(index)} />
        </div>
      ))}
    </div>
  );
}

export default SeeRequests;
