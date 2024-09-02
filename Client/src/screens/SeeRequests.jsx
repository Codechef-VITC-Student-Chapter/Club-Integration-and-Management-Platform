import React, { useState } from 'react';
import LeadRequests from '../components/LeadRequests';

const requestsData = [
  {
    id: '1',
    club: 'Club 1',
    department: 'Department 1',
    lead: 'Lead 1',
    title: 'Request Title 1',
    description: 'Request Description 1',
    links: ['http://example.com/1'],
    status: 'Pending',
  },
  {
    id: '2',
    club: 'Club 2',
    department: 'Department 3',
    lead: 'Lead 5',
    title: 'Request Title 2',
    description: 'Request Description 2',
    links: ['http://example.com/2'],
    status: 'Pending',
  },
  {
    id: '3',
    club: 'Club 3',
    department: 'Department 2',
    lead: 'Lead 3',
    title: 'Request Title 3',
    description: 'Request Description 3',
    links: ['http://example.com/3'],
    status: 'Pending',
  },
  {
    id: '4',
    club: 'Club 4',
    department: 'Department 4',
    lead: 'Lead 4',
    title: 'Request Title 4',
    description: 'Request Description 4',
    links: ['http://example.com/4'],
    status: 'Pending',
  },
  {
    id: '5',
    club: 'Club 5',
    department: 'Department 5',
    lead: 'Lead 2',
    title: 'Request Title 5',
    description: 'Request Description 5',
    links: ['http://example.com/5'],
    status: 'Pending',
  },
];

function ReviewRequests() {
  const [requests, setRequests] = useState(requestsData);
  const [removing, setRemoving] = useState(null); // Track the removing request

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
