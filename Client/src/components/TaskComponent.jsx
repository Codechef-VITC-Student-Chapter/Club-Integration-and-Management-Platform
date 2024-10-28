import React, { useState } from "react";
import { FaUser, FaCodeBranch, FaCalendarAlt } from "react-icons/fa"; // Import necessary icons using this npm install react-icons

const TaskComponent = ({ taskName, target, department, date, description, id, points, status }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const taskColor = status === "accepted"
    ? 'rgba(25, 135, 84, 1)'
    : status === "rejected"
    ? 'rgba(220, 53, 69, 1)'
    : 'rgba(255, 172, 51, 1)';

  const textColor = status === "pending" ? 'black' : taskColor;
  const isPending = status === "pending"; 

  return (
    <div 
      className="relative max-w-sm border rounded-xl p-4 shadow-lg bg-white font-sans md:max-w-md md:p-6" 
      style={{ 
        fontFamily: 'Lato, sans-serif', 
        border: `1px solid ${taskColor}`,
        width: '100%',
      }}
    >
      <div
        className="absolute -top-0 left-0 rounded-tl-lg rounded-br-lg px-6 py-3 md:px-8 md:py-4"
        style={{ backgroundColor: taskColor }}
      >
        <h2 
          className="font-bold text-lg md:text-xl md:px-2"
          style={{ color: isPending ? 'black' : 'white' }} 
        >
          {taskName}
        </h2>
      </div>

      <div className="flex justify-between items-center mt-12 mb-4 md:mt-14 md:mb-6">
        <div className="space-y-2">
          <div className="text-sm flex items-center md:text-lg " style={{ color: textColor, fontWeight: 500 }}>
            <FaUser className="mr-2" />
            <strong>Target:</strong> {target}
          </div>

          <div className="text-sm flex items-center md:text-lg" style={{ color: textColor, fontWeight: 500 }}>
            <FaCodeBranch className="mr-2" />
            <strong>Department:</strong> {department}
          </div>

          <div className="text-sm flex items-center md:text-lg" style={{ color: textColor, fontWeight: 500 }}>
            <FaCalendarAlt className="mr-2" />
            <strong>Date:</strong> {date}
          </div>
        </div>

        <div
          className="rounded-full h-[52px] w-[52px] flex items-center justify-center md:h-[60px] md:w-[60px] md:text-xl"
          style={{ backgroundColor: taskColor, color: isPending ? 'black' : 'white' }} 
        >
          {points}
        </div>
      </div>

      <div className="text-sm mb-4 md:text-lg" style={{ color: textColor, fontWeight: 500 }}>
        <strong>Task Description:</strong>{" "}
        {isExpanded ? (
          <span>
            {description}{" "}
            <button
              className="underline"
              onClick={() => setIsExpanded(false)}
              style={{ color: textColor, fontWeight: 300 }}>
              See Less
            </button>
          </span>
        ) : (
          <span>
            {description.slice(0, 100)}...{" "}
            <button
              className="underline"
              onClick={() => setIsExpanded(true)} style={{ color: textColor, fontWeight: 500 }}>
              See More
            </button>
          </span>
        )}
      </div>

      <div className="text-xs text-gray-500 mt-4 md:text-sm">
        {id}
      </div>
    </div>
  );
};

export default TaskComponent;
