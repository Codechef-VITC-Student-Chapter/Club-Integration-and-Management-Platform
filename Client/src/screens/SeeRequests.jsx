import React, { useEffect, useState } from 'react';
import LeadRequests from '../components/LeadRequests';

function ReviewRequests() {
  const [requests, setRequests] = useState([]);
  const [removing, setRemoving] = useState(null);

  useEffect(() => {
    // API call, sending user ID, wanting all requests with this user as target. Set this to requests using setRequests
  }, []);

  const removeRequest = (index) => {
    // Send API call to update the request to Accepted or Denied

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
          key={request.id}
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

export default ReviewRequests;
