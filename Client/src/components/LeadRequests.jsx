import React, { useState } from 'react';
import { toast } from 'react-toastify';
import DenialReasonModal from './DenialReasonModal';

const toastProps = {
  draggable: true,
  pauseOnHover: true,
  closeOnClick: true,
  autoClose: 2000,
};

function LeadRequests({ request, remove }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleApproval = () => {
    toast.success('The request has been approved!', toastProps);
    remove();
  };

  const handleDenial = (reason) => {
    toast.error(`Denied request ${request.id} for "${reason}"`, toastProps);
    setIsModalOpen(false);
    remove();
  };

  return (
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
      <div className="text-gray-600 mb-4">
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
