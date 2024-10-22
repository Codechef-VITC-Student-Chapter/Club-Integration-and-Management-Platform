import React from 'react';

function DenialReasonModal({ isOpen, onClose, onSubmit }) {
  const [reason, setReason] = React.useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit(reason);
    setReason('');
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-xl font-semibold mb-4">Reason for Denial</h2>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Enter your reason..."
          className="w-full p-2 border rounded-md mb-4"
          rows="4"
        />
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-md hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default DenialReasonModal;
