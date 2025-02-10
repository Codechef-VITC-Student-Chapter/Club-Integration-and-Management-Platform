import { useState } from "react";
import { FaUser, FaCodeBranch, FaCalendarAlt } from "react-icons/fa";

const TaskComponent = ({
  taskName,
  target,
  department,
  date,
  description,
  id,
  points,
  status,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSeeMoreClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const colorSchemes = {
    'Pending': {
      text: 'text-gray-700',
      pointsBg: 'bg-yellow-500',
      border: 'border-yellow-500',
      headerBg: 'bg-yellow-500',
      headerText: 'text-gray-700'
    },
    'Accepted': {
      text: 'text-green-800',
      pointsBg: 'bg-green-600',
      border: 'border-green-500',
      headerBg: 'bg-green-600',
      headerText: 'text-white'
    },
    'Rejected': {
      text: 'text-red-800',
      pointsBg: 'bg-red-600',
      border: 'border-red-500',
      headerBg: 'bg-red-600',
      headerText: 'text-white',
    }
  };

  const colors = colorSchemes[status] || colorSchemes['Pending'];

  const displayDescription = status === 'Rejected' 
    ? "Reason for rejection" 
    : description;

  return (
    <div className={`relative w-full max-w-sm border rounded-xl p-4 shadow-md bg-white ${colors.text} ${colors.border}`}>
      <div className={`w-10 h-10 absolute top-5 right-5 rounded-full p-2 ${colors.pointsBg} text-white flex justify-center items-center`}>
        {points}
      </div>
      
      <div className={`absolute top-0 left-0 rounded-tl-xl px-8 py-2 ${colors.headerBg} rounded-br-[0.5rem]`}>
        <h2 className={`font-semibold ${colors.headerText}`}>{taskName}</h2>
      </div>

      <div className="mt-8 space-y-2">
        <div className={`flex items-center text-sm ${colors.text}`}>
          <FaUser className="mr-2" />
          <span><strong>Target:</strong> {target}</span>
        </div>

        <div className={`flex items-center text-sm ${colors.text}`}>
          <FaCodeBranch className="mr-2" />
          <span><strong>Department:</strong> {department}</span>
        </div>

        <div className={`flex items-center text-sm ${colors.text}`}>
          <FaCalendarAlt className="mr-2" />
          <span><strong>Date:</strong> {date}</span>
        </div>
      </div>

      <div className={`mt-3 text-sm ${colors.text}`}>
        <strong>{status === 'Rejected' ? 'Rejection Reason' : 'Task Description'}:</strong>{" "}
        {displayDescription.length > 50 ? (
          <>
            {displayDescription.slice(0, 50)}...{" "}
            <button
              className={`underline font-medium ${colors.text}`}
              onClick={handleSeeMoreClick}
            >
              See More
            </button>
          </>
        ) : (
          displayDescription
        )}
      </div>

      <div className="text-xs text-gray-400 mt-2">{id}</div>
    </div>
  );
};

export default TaskComponent;