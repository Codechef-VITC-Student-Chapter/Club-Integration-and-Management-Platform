import React, { useState } from "react";
import { FaUser, FaCodeBranch, FaCalendarAlt } from "react-icons/fa";
import TaskModal from "./Popup.jsx"; // Adjust the path if needed

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

  const taskColor =
    status === "approved"
      ? "rgba(25, 135, 84, 1)"
      : status === "rejected"
      ? "rgba(220, 53, 69, 1)"
      : "rgba(255, 172, 51, 1)";

  const textColor = status === "pending" ? "black" : taskColor;
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
  className="relative max-w-sm border rounded-xl p-4 md:p-6 shadow-lg bg-white font-sans w-full"
  style={{
    fontFamily: "Lato, sans-serif",
    border: `1px solid ${taskColor}`,
    wordWrap: "break-word",
    overflowWrap: "break-word",
    width: "100%",
    display: "flex",
    flexDirection: "column",
  }}
  key={id}
>
<div
          className="absolute -top-0 left-0 rounded-tl-lg rounded-br-lg xs:rounded-tr-lg px-6 py-3 md:px-8 md:py-2"
          style={{ backgroundColor: taskColor }}
        >
          <h2
            className="font-bold text-lg md:text-xl md:px-2"
            style={{ color: isPending ? "black" : "white" }}
          >
            {taskName}
          </h2>
        </div>

        <div className="flex justify-between items-center mt-12 mb-4 md:mt-7 md:mb-3">
          <div className="space-y-3">
          <div
  className="text-sm md:text-[15px] pt-4 max-w-[200px] whitespace-normal break-words"
  style={{ color: textColor, fontWeight: 500 }}
>
  <div className="flex items-center">
    <FaUser className="p-0" />
    <strong>Target:</strong>
  </div>
  <div>{target}</div>
</div>


<div
  className="text-sm md:text-[15px] p-0 max-w-[200px] whitespace-normal break-words"
  style={{ color: textColor, fontWeight: 500 }}
>
  <div className="flex items-center">
    <FaCodeBranch className="p-0" />
    <strong>Department:</strong>
  </div>
  <div>{department}</div>
</div>
            <div
              className="text-sm md:text-[15px] p-0 max-w-[200px] whitespace-normal break-words"
              style={{ color: textColor, fontWeight: 500 }}
            >
              <FaCalendarAlt className="mr-2" />
              <strong>Date:</strong> 
              <div>{date}</div>
            </div>
          </div>

          {points !== undefined && (
  <div
    className="rounded-full flex items-center justify-center mr-11 p-2  bg-transparent"
    style={{
      backgroundColor: taskColor,
      color: isPending ? "black" : "white",
    }}
  >
    <span className="w-16 h-16 md:w-16 md:h-16 lg:w-20 lg:h-20 flex items-center xs:pr-12 justify-center text-lg">
      {points}
    </span>
  </div>
)}

        </div>

        <div
          className="text-sm mb-4 md:text-sm"
          style={{ color: textColor, fontWeight: 500 }}
        >
          <strong>Task Description:</strong>{" "}
          {description.length > 50 ? (
            <>
              {description.slice(0, 50) + "... "}
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

        <div className="text-xs text-gray-500 mt-4 md:text-sm">{id}</div>
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
