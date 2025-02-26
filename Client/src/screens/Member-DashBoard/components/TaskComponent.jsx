import { useState } from "react";
import { FaUser, FaCodeBranch, FaCalendarAlt } from "react-icons/fa";
import TaskModal from "./popup.jsx";

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
        className="relative border rounded-xl p-2 shadow-lg bg-white w-full font-sans max-w-[300px] md:max-w-sm"
        style={{
          fontFamily: "Lato, sans-serif",
          border: `1px solid ${taskColor}`,
        }}
        key={id}
      >
        {/* Header Tag */}
        <div
          className="absolute -top-0 left-0 rounded-tl-lg rounded-br-lg px-2 py-1 md:px-4 md:py-1"
          style={{ backgroundColor: taskColor }}
        >
          <h2
            className="font-bold text-[12px] md:text-lg"
            style={{ color: isPending ? "black" : "white" }}
          >
            {taskName}
          </h2>
        </div>

        {/* Main Content Area */}
        <div className="mt-7 md:mt-10 mb-1 md:mb-3">
          {/* Info and Points Section */}
          <div className="flex justify-between items-start">
            {/* Left Side Info */}
            <div className="space-y-1 w-3/4">
              <div
                className="text-[10px] md:text-sm flex items-center"
                style={{ color: textColor, fontWeight: 500 }}
              >
                <FaUser className="mr-1 flex-shrink-0" />
                <span><strong>Target:</strong> {target}</span>
              </div>

              <div
                className="text-[10px] md:text-sm flex items-center"
                style={{ color: textColor, fontWeight: 500 }}
              >
                <FaCodeBranch className="mr-1 flex-shrink-0" />
                <span className="break-words"><strong>Department:</strong> {department}</span>
              </div>

              <div
                className="text-[10px] md:text-sm flex items-center"
                style={{ color: textColor, fontWeight: 500 }}
              >
                <FaCalendarAlt className="mr-1 flex-shrink-0" />
                <span><strong>Date:</strong> {date}</span>
              </div>
            </div>

            {/* Points Circle - Right Side - Now positioned better */}
            {points !== undefined && (
              <div className="w-1/4 flex justify-end">
                <div
                  className="rounded-full w-[35px] h-[35px] flex items-center justify-center text-[10px] md:w-[50px] md:h-[50px] md:text-lg flex-shrink-0"
                  style={{
                    backgroundColor: taskColor,
                    color: isPending ? "black" : "white",
                  }}
                >
                  {points}
                </div>
              </div>
            )}
          </div>

          {/* Description Section */}
          <div
            className="text-[10px] md:text-sm mt-2 md:mt-3"
            style={{ color: textColor, fontWeight: 500 }}
          >
            <strong>Task Description:</strong>{" "}
            <span className="block mt-1">
              {description.length > 30 ? (
                <>
                  {description.slice(0, 30) + "... "}
                  <button
                    className="underline"
                    onClick={handleSeeMoreClick}
                    style={{ color: taskColor, fontWeight: 500 }}
                  >
                    See More
                  </button>
                </>
              ) : (
                description
              )}
            </span>
          </div>
        </div>

        {/* ID Footer */}
        <div className="text-[8px] md:text-xs text-gray-500 mt-1">
          ID: {id}
        </div>
      </div>

      {/* Modal */}
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