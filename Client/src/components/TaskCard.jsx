import React, { useState } from "react";
import { FaUser, FaCodeBranch, FaCalendarAlt } from "react-icons/fa";
import TaskModal from "./popup.jsx"; // Adjust the path if needed

const TaskComponent = ({
  taskName,
  target,
  department,
  date,
  description,
  id,
  points,
  status
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const taskColor = status === "accepted"
    ? 'rgba(25, 135, 84, 1)'
    : status === "rejected"
      ? 'rgba(220, 53, 69, 1)'
      : 'rgba(255, 172, 51, 1)';

  const textColor = status === "pending" ? 'black' : taskColor;
  const isPending = status === "pending";

  const handleSeeMoreClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div
        className="relative max-w-sm border rounded-xl p-4 shadow-lg bg-white font-sans md:min-w-[312px] md:p-6 md:max-h-[280px]"
        style={{
          fontFamily: 'Lato, sans-serif',
          border: `1px solid ${taskColor}`,
          width: '100%',
        }}
      >
        <div
          className="absolute -top-0 left-0 rounded-tl-lg rounded-br-lg px-6 py-3 md:px-8 md:py-2"
          style={{ backgroundColor: taskColor }}
        >
          <h2
            className="font-bold text-lg md:text-xl md:px-2"
            style={{ color: isPending ? 'black' : 'white' }}
          >
            {taskName}
          </h2>
        </div>
        <div className="flex justify-between items-center mt-12 mb-4 md:mt-7 md:mb-6">
          <div className="space-y-2">
            <div className="text-sm flex items-center md:text-[15px]" style={{ color: textColor, fontWeight: 500 }}>
              <FaUser className="mr-2" />
              <strong>Target:</strong> {target}
            </div>

            <div className="text-sm flex items-center md:text-[15px]" style={{ color: textColor, fontWeight: 500 }}>
              <FaCodeBranch className="mr-2" />
              <strong>Department:</strong> {department}
            </div>

            <div className="text-sm flex items-center md:text-[15px]" style={{ color: textColor, fontWeight: 500 }}>
              <FaCalendarAlt className="mr-2" />
              <strong>Date:</strong> {date}
            </div>
          </div>

          {points !== undefined && (
            <div
              className="rounded-full h-[52px] w-[52px] flex items-center justify-center md:h-[60px] md:w-[60px] md:text-xl"
              style={{ backgroundColor: taskColor, color: isPending ? 'black' : 'white' }}
            >
              {points}
            </div>
          )}
        </div>

        <div className="text-sm mb-4 md:text-sm" style={{ color: textColor, fontWeight: 500 }}>
          <strong>Task Description:</strong>{" "}
          {description.length > 100 ? (
            <>
              {description.slice(0, 100) + "... "}
              <button
                className="underline"
                onClick={handleSeeMoreClick}
                style={{ color: textColor, fontWeight: 500 }}
              >
                See More
              </button>
            </>
          ) : (
            <>{description}</>
          )}
        </div>

        <div className="text-xs text-gray-500 mt-4 md:text-sm">
          {id}
        </div>
      </div>

      {/* Render TaskModal conditionally when See More is clicked */}
      {isModalOpen && (
        <TaskModal
          taskName={taskName}
          target={target}
          department={department}
          date={date}
          description={description}
          id={id}
          points={points}
          status={status}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default TaskComponent;