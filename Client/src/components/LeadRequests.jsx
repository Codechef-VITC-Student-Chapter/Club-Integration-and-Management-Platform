import React, { useState } from 'react';
import { toast } from 'react-toastify';
import DenialReasonModal from './DenialReasonModal';
import { useRunningContext } from '../contexts/RunningContext';

const toastProps = {
  draggable: true,
  pauseOnHover: true,
  closeOnClick: true,
  autoClose: 2000,
};

function LeadRequests({ request, remove }) {
  const { baseURL, token } = useRunningContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleApproval = async () => {
    const res = await fetch(
      `${baseURL}/contApi/update-status/${request.cont_id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'approved' }),
      }
    );
    if (res.status == 200) {
      toast.success('The request has been approved!', toastProps);
      remove();
    } else {
      console.log('IDK WHY THINGS DIDNT WORK IN LEADREQUESTS.JSX');
    }
  };

  const handleDenial = async (reason) => {
    const res = await fetch(
      `${baseURL}/contApi/update-status/${request.cont_id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'rejected' }),
      }
    );
    if (res.status == 200) {
      toast.error(`Denied request ${request.cont_id}`, toastProps);
      setIsModalOpen(false);
      remove();
    } else {
      console.log('IDK WHY THINGS DIDNT WORK IN LEADREQUESTS.JSX in DENY');
    }
  };

  return (
    <div key={request.cont_id} className="border-b border-gray-200 mb-4 pb-4">
      <p className="text-gray-500 text-xs">{request.cont_id}</p>
      <h2 className="text-xl font-semibold">{request.title}</h2>
      <p className="text-gray-700 mb-2">{request.desc}</p>
      <p className="text-gray-600 mb-2">
        <strong>Points Requested:</strong> {request.points}
      </p>
      <p className="text-gray-600 mb-2">
        <strong>Department:</strong> {request.dname}
      </p>
      <p className="text-gray-600 mb-2">
        <strong>User:</strong> {request.user}
      </p>
      <div className="text-gray-600 mb-4">
        <strong>Links:</strong>
        <ul>
          {request.proof_files.map((link, index) => (
            <li key={index}>
              <a href={link} className="text-blue-500 hover:underline">
                {link}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex space-x-4">
        <button
          onClick={handleApproval}
          className="px-4 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600"
        >
          Approve
        </button>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600"
        >
          Deny
        </button>
      </div>

      {/* Render the DenialReasonModal */}
      <DenialReasonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleDenial}
      />
    </div>
  );
}

export default LeadRequests;
