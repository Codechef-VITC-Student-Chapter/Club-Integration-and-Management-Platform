import PropTypes from "prop-types";
import { useState } from "react";
import RejectBox from "./RejectBox";

function AdminInboxCard({ request, onUpdateStatus }) {
  const [rejecttoggle, settoggle] = useState(false);
  const [reason, setReason] = useState("");

  const handleApprove = () => {
    onUpdateStatus(request.id, "approved");
  };

  const handleDeny = () => {
    onUpdateStatus(request.id, "rejected", reason);
  };

  const handleChangeStatus = (newStatus) => {
    onUpdateStatus(request.id, newStatus);
  };

  const backgroundColor =
    request.status === "approved"
      ? "bg-[#9FEFA8]"
      : request.status === "rejected"
      ? "bg-[#F4AAAA]"
      : "bg-white";

  const borderColor =
    request.status === "approved"
      ? "border-green-900 border-2"
      : request.status === "rejected"
      ? "border-red-900 border-2"
      : "border-black";

  return rejecttoggle ? (
    <RejectBox
      onClose={() => {
        settoggle(false);
      }}
      onSubmit={() => {
        handleDeny();
        settoggle(false);
      }}
      title={request.title}
      points={request.points}
      username={request.id}
      toggle={rejecttoggle}
      setReason={setReason}
    />
  ) : (
    <div
      className={`w-[99%] max-w-full p-6 rounded-3xl shadow-2xl border-[2px] ${borderColor} transition-colors duration-300 ${backgroundColor}`}
    >
      <div className="flex flex-col md:flex-row justify-between">
        {/* Main Content Section */}
        <div className="mb-4 md:mb-0 md:w-1/2 pr-4">
          <div className="text-[14px] font-mono mb-4 text-black">
            Request ID: {request.id}
          </div>
          <h1 className="text-[20px] md:text-[22px] font-bold mb-2 text-black truncate break-words">
            {request.title}
          </h1>
          <p className="text-[16px] text-black mb-2 break-words truncate">
            {request.description}
          </p>

          {/* Display rejection reason when status is rejected */}
          {request.status === "rejected" && request.reason && (
            <div className="mt-2 mb-2">
              <p className="text-[16px] font-bold text-black">
                Rejection Reason:
              </p>
              <p className="text-[15px] text-black">{request.reason}</p>
            </div>
          )}
        </div>

        {/* Info Section - keeping original style but fixing layout */}
        <div className="md:w-1/2">
          <div className="flex flex-wrap md:flex-nowrap justify-between items-center gap-2 text-[16px] font-bold text-black mb-6">
            <p className="w-full md:w-1/3 text-center">
              Points Requested: {request.points}
            </p>
            <p className="w-full md:w-1/3 text-center">
              Department: {request.department}
            </p>
            <p className="w-full md:w-1/3 text-center">
              User: {request.user_id}
            </p>
          </div>
        </div>
      </div>

      {/* Link and Buttons Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-4">
        <div className="max-w-full overflow-hidden">
          <span className="text-black mr-2 font-medium">Links:</span>
          <ul className="mt-1">
            {request.proof_files.map((link, idx) => (
              <li key={idx} className="overflow-hidden text-ellipsis">
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline break-all"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex gap-4 items-center mt-4 md:mt-0 flex-wrap">
          {request.status === "pending" && (
            <>
              <button
                className="bg-[#198754] text-white px-6 py-2 rounded hover:bg-green-600"
                onClick={handleApprove}
              >
                Approve
              </button>
              <button
                className="bg-[#DC3545] text-white px-6 py-2 rounded hover:bg-red-600"
                onClick={() => settoggle(true)}
              >
                Reject
              </button>
            </>
          )}
          {request.status !== "pending" && (
            <>
              <button
                className={`px-6 py-2 rounded text-white transition-all duration-300 ${
                  request.status === "approved"
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                {request.status === "approved" ? "✔ Approved" : "✘ Rejected"}
              </button>
              <button
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                onClick={() => {
                  if (request.status === "approved") {
                    settoggle(true);
                  } else {
                    handleChangeStatus("approved");
                  }
                }}
              >
                Change Status
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

AdminInboxCard.propTypes = {
  request: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    points: PropTypes.number.isRequired,
    department: PropTypes.string.isRequired,
    user_id: PropTypes.string.isRequired,
    proof_files: PropTypes.arrayOf(PropTypes.string).isRequired,
    status: PropTypes.string.isRequired,
    reason: PropTypes.string,
  }).isRequired,
  onUpdateStatus: PropTypes.func.isRequired,
};

export default AdminInboxCard;
