import { useState } from "react";
import { FaUser, FaCodeBranch, FaCalendarAlt } from "react-icons/fa";
import TaskModal from "../screens/Member-DashBoard/components/popup.jsx"; // Adjust the path if needed

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

  const reason_for_rejection =
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse non, molestias nemo, iure fugiat quis vel ad quidem quo saepe iusto culpa dolore nisi odio asperiores reiciendis omnis hic harum.";

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
        className="relative max-w-sm border rounded-xl p-4 shadow-lg bg-white font-sans md:min-w-[312px] md:p-6"
        style={{
          fontFamily: "Lato, sans-serif",
          border: `1px solid ${taskColor}`,
          width: "100%",
        }}
        key={id}
      >
        <div
          className="absolute -top-0 left-0 rounded-tl-lg rounded-br-lg px-6 py-3 md:px-8 md:py-2 max-w-[70%]"
          style={{ backgroundColor: taskColor }}
        >
          <h2
            className="font-bold text-lg md:text-xl md:px-2 truncate"
            style={{ color: isPending ? "black" : "white" }}
          >
            {taskName}
          </h2>
        </div>
        <div className="flex justify-between items-center mt-12 mb-4 md:mt-7 md:mb-3">
          <div className="space-y-2">
            <div
              className="text-sm flex items-center md:text-[15px]"
              style={{ color: textColor, fontWeight: 500 }}
            >
              <FaUser className="mr-2" />
              <strong>Target:</strong> {target}
            </div>

            <div
              className="text-sm flex items-center md:text-[15px] "
              style={{ color: textColor, fontWeight: 500 }}
            >
              <FaCodeBranch className="mr-2" />
              <strong>Department:</strong> {department}
            </div>

            <div
              className="text-sm flex items-center md:text-[15px]"
              style={{ color: textColor, fontWeight: 500 }}
            >
              <FaCalendarAlt className="mr-2" />
              <strong>Date:</strong> {date}
            </div>
          </div>

          {points !== undefined && (
            <div
              className="absolute top-2 right-2 xs:relative rounded-full size-[60px] flex items-center justify-center md:w-[60px] md:text-xl"
              style={{
                backgroundColor: taskColor,
                color: isPending ? "black" : "white",
              }}
            >
              {points}
            </div>
          )}
        </div>

        <div
          className="text-sm mb-4 md:text-sm"
          style={{ color: textColor, fontWeight: 500 }}
        >
          <strong>
            {status === "rejected"
              ? "Reason for Rejection:"
              : "Task Description:"}
          </strong>{" "}
          {status === "rejected" ? (
            reason_for_rejection.length > 50 ? (
              <>
                {reason_for_rejection.slice(0, 50) + "... "}
                <button
                  className="underline"
                  onClick={handleSeeMoreClick}
                  style={{ color: textColor, fontWeight: 500 }}
                >
                  See More
                </button>
              </>
            ) : (
              reason_for_rejection
            )
          ) : description.length > 50 ? (
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

        <div className="text-xs text-gray-500 mt-4 md:text-sm ">{id}</div>
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
