import React, { useState } from "react";

const CardComponent = () => {
  const [status, setStatus] = useState("default");

  const handleApprove = () => {
    setStatus("approved");
  };

  const handleDeny = () => {
    setStatus("denied");
  };

  const handleChangeStatus = () => {
    setStatus("default");
  };

  const backgroundColor =
    status === "approved" ? "bg-[#9FEFA8]" : status === "denied" ? "bg-[#F4AAAA]" : "bg-white";

  return (
    <div className="flex items-center justify-center  bg-[#E0E7FF] m-5">
      <div
        className={`w-[95%] max-w-full mx-4 p-6 rounded-xl shadow-md border-[1px] border-black transition-colors duration-300 ${backgroundColor}`}
      >
        <div className="flex flex-col md:flex-row justify-between">
          {/* Left Section */}
          <div className="w-full md:max-w-[70%] mb-4 md:mb-0">
            {/* Random Number and Alphabets */}
            <div className="text-[14px] font-mono mb-4 text-black">
              CID22BCE50071272002483824
            </div>

            {/* Dummy Text Heading */}
            <h1 className="text-[20px] md:text-[22px] font-bold mb-2 w-full text-black">
              Backend And Hosting For Flappy Chef
            </h1>

            {/* Content constrained to the width of the heading */}
            <div className="max-w-md">
              <p className="text-[16px] mb-4 text-black">
                Made the complete backend for Flappy Chef and assisted the department lead in hosting
                the same. Guided the department members in completing the backend work for the same.
              </p>
            </div>
          </div>

          {/* Right-Side Information */}
          <div className="flex flex-col space-y-4 w-full lg:max-w-[40%] md:max-w-[30%] my-auto">
            <div className="flex flex-col lg:flex-row justify-between ">
              <div className="text-left mb-2 md:mb-0 flex md:flex-col md:items-center gap-2 md:gap-0">
                <p className="text-[16px] font-bold text-black">Points Requested:</p>
                <p className="text-[16px] text-black">50</p>
              </div>
              <div className="text-left mb-2 md:mb-0 flex md:flex-col md:items-center gap-2 md:gap-0">
                <p className="text-[16px] font-bold text-black">Department:</p>
                <p className="text-[16px] text-black">Web Development</p>
              </div>
              <div className="text-left flex md:flex-col md:items-center gap-2 md:gap-0">
                <p className="text-[16px] font-bold text-black">User:</p>
                <p className="text-[16px] text-black">UID22BCE5007</p>
              </div>
            </div>
          </div>
        </div>

        {/* Link and Buttons Section */}
        <div className="flex flex-col md:flex-row w-full justify-between items-center mt-6">
          {/* Random Link */}
          <a
            href="https://github.com/Codechef-VITC-Student-Chapter/Flappy-Bird/tree/dev-two"
            className="text-blue-500 text-[16px] mb-4 md:mb-0"
          >
            Links: https://github.com/Codechef-VITC-Student-Chapter/Flappy-Bird/tree/dev-two
          </a>

          {/* Buttons Section */}
          <div className="flex md:justify-end gap-4 items-center w-fit">
            {status === "default" && (
              <>
                <button
                  className="bg-[#198754] text-white px-6 py-2 rounded hover:bg-green-600"
                  onClick={handleApprove}
                >
                  Approve
                </button>
                <button
                  className="bg-[#DC3545] text-white px-6 py-2 rounded hover:bg-red-600"
                  onClick={handleDeny}
                >
                  Deny
                </button>
              </>
            )}

            {status !== "default" && (
              <div className="flex space-x-2">
                <button
                  className="bg-[#4079DA] text-white px-6 py-2 rounded hover:bg-blue-700"
                  onClick={handleChangeStatus}
                >
                  Change Status
                </button>
                <button
                  className={`px-6 py-2 rounded text-white transition-all duration-300 ${
                    status === "approved"
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-red-500 hover:bg-red-600"
                  }`}
                >
                  {status === "approved" ? "✔ Approved" : "✘ Denied"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardComponent;
