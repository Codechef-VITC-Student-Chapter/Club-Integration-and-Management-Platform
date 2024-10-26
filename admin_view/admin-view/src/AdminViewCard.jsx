// AdminViewCard.js
import React from 'react';

function AdminViewCard({ id, status, onUpdateStatus }) {
  const handleApprove = () => {
    onUpdateStatus(id, "approved");
  };

  const handleDeny = () => {
    onUpdateStatus(id, "denied");
  };

  const handleChangeStatus = () => {
    onUpdateStatus(id, "default");
  };

  const backgroundColor =
    status === "approved" ? "bg-[#9FEFA8]" : status === "denied" ? "bg-[#F4AAAA]" : "bg-white";

  const borderColor =
    status === "approved" ? "border-green-900 border-2" : status === "denied" ? "border-red-900 border-2" : "border-black";

  return (
    <div className={`w-[95%] max-w-full mx-4 p-6 rounded-3xl shadow-2xl border-[2px] ${borderColor} transition-colors duration-300 ${backgroundColor}`}>
      
      {/* Text Content Container */}
      <div className="flex flex-col text-left mb-6">
        <div className="text-[14px] font-mono mb-4 text-black">
          CID22BCE50071272002483824
        </div>
        <h1 className="text-[20px] md:text-[22px] font-bold mb-2 text-black">
          Backend And Hosting For Flappy Chef
        </h1>
        <p className="text-[16px] text-black max-w-md">
          Made the complete backend for Flappy Chef and assisted the department lead in hosting the same.
        </p>
      </div>

      {/* Link and Buttons Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-6">
        <a href="https://github.com/Codechef-VITC-Student-Chapter/Flappy-Bird/tree/dev-two"
          className="text-blue-500 text-[16px]">
          <span className="text-black mr-2">Links:</span> GitHub Link
        </a>

        <div className="flex gap-4 items-center">
          {status === "default" && (
            <>
              <button className="bg-[#198754] text-white px-6 py-2 rounded hover:bg-green-600" onClick={handleApprove}>
                Approve
              </button>
              <button className="bg-[#DC3545] text-white px-6 py-2 rounded hover:bg-red-600" onClick={handleDeny}>
                Deny
              </button>
            </>
          )}
          {status !== "default" && (
            <>
              <button className={`px-6 py-2 rounded text-white transition-all duration-300 ${
                status === "approved" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
              }`}>
                {status === "approved" ? "✔ Approved" : "✘ Denied"}
              </button>
              <button className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600" onClick={handleChangeStatus}>
                Change Status
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminViewCard;
