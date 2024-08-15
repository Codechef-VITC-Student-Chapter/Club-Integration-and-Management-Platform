import React, { useState } from 'react';

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
  // Add more requests as needed
];

function ReviewRequests() {
  const [requests, setRequests] = useState(requestsData);

  const handleApproval = (id, decision) => {
    setRequests((prevRequests) =>
      prevRequests.map((req) =>
        req.id === id ? { ...req, status: decision } : req
      )
    );
    console.log(`Request ${id} ${decision}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Review Requests</h1>
      {requests.map((request) => (
        <div key={request.id} className="border-b border-gray-200 mb-4 pb-4">
          <h2 className="text-xl font-semibold">{request.title}</h2>
          <p className="text-gray-700 mb-2">{request.description}</p>
          <p className="text-gray-600 mb-2">
            <strong>Club:</strong> {request.club}
          </p>
          <p className="text-gray-600 mb-2">
            <strong>Department:</strong> {request.department}
          </p>
          <p className="text-gray-600 mb-2">
            <strong>Lead:</strong> {request.lead}
          </p>
          <p className="text-gray-600 mb-4">
            <strong>Links:</strong>
            <ul>
              {request.links.map((link, index) => (
                <li key={index}>
                  <a href={link} className="text-blue-500 hover:underline">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </p>
          <div className="flex space-x-4">
            <button
              onClick={() => handleApproval(request.id, 'Approved')}
              className="px-4 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600"
            >
              Approve
            </button>
            <button
              onClick={() => handleApproval(request.id, 'Denied')}
              className="px-4 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600"
            >
              Deny
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ReviewRequests;
