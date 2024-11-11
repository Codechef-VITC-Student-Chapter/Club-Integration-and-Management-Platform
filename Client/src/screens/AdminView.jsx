// Admin_view.js
import React, { useState } from 'react';

import dot from '../assets/adminview/Admin_view_dot.png';
import tick from '../assets/adminview/Admin_view_tick.png';
import file from '../assets/adminview/Admin_view_file.png'

function AdminView() {
  // Sample data with initial status for each card
  const [requests, setRequests] = useState([
    { id: 1, status: "default" ,heading:"Backend And Hosting For Flappy Chef",
      infotext:"Made the complete backend for Flappy Chef and assisted the department lead in hosting the same.",
      link:'https://example.com/',dept:"web",userid:1,points_requested:50
    },
    { id: 2, status: "default" ,heading:"Backend And Hosting For Flappy Chef",
      infotext:"Made the complete backend for Flappy Chef and assisted the department lead in hosting the same.",
      link:'https://example.com/',dept:"web",userid:2,points_requested:50
    },
    { id: 3, status: "default" ,heading:"Backend And Hosting For Flappy Chef",
      infotext:"Made the complete backend for Flappy Chef and assisted the department lead in hosting the same.",
      link:'https://example.com/',dept:"web",userid:3,points_requested:50
    },
  ]);

  // Function to update the status of a request
  const updateStatus = (id, newStatus) => {
    console.log(true)
    setRequests((prevRequests) =>
      prevRequests.map((request) =>
        request.id === id ? { ...request, status: newStatus } : request
      )
    );
  };

  // Filter requests into Pending and Completed based on status
  const pendingRequests = requests.filter((req) => req.status === "default");
  const completedRequests = requests.filter((req) => req.status !== "default");
  console.log(completedRequests)


  const AdminViewCard = ({status,id,key,onUpdateStatus,dept,userid,link,infotext,heading,points_requested}) => {
    
  
    const handleApprove = () => {
      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.id === id ? { ...request, status: 'approved' } : request
        ))
    };
  
    const handleDeny = () => {
      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.id === id ? { ...request, status: 'denied' } : request
        ))
    };
  
    const handleChangeStatus = () => {
      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.id === id ? { ...request, status: 'default' } : request
        ))
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
                {id}
              </div>
  
              {/* Dummy Text Heading */}
              <h1 className="text-[20px] md:text-[22px] font-bold mb-2 w-full text-black">
                {heading}
              </h1>
  
              {/* Content constrained to the width of the heading */}
              <div className="max-w-md">
                <p className="text-[16px] mb-4 text-black">
                  {infotext}
                </p>
              </div>
            </div>
  
            {/* Right-Side Information */}
            <div className="flex flex-col space-y-4 w-full lg:max-w-[40%] md:max-w-[30%] my-auto">
              <div className="flex flex-col lg:flex-row justify-between ">
                <div className="text-left mb-2 md:mb-0 flex md:flex-col md:items-center gap-2 md:gap-0">
                  <p className="text-[16px] font-bold text-black">Points Requested:</p>
                  <p className="text-[16px] text-black">{points_requested}</p>
                </div>
                <div className="text-left mb-2 md:mb-0 flex md:flex-col md:items-center gap-2 md:gap-0">
                  <p className="text-[16px] font-bold text-black">Department:</p>
                  <p className="text-[16px] text-black">{dept}</p>
                </div>
                <div className="text-left flex md:flex-col md:items-center gap-2 md:gap-0">
                  <p className="text-[16px] font-bold text-black">User:</p>
                  <p className="text-[16px] text-black">{userid}</p>
                </div>
              </div>
            </div>
          </div>
  
          {/* Link and Buttons Section */}
          <div className="flex flex-col md:flex-row w-full justify-between items-center mt-6">
            {/* Random Link */}
            <a
              href={link}
              className="text-blue-500 text-[16px] mb-4 md:mb-0"
            >
              Links: {link}
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
  
  
  
  return (
    <div className='w-full  flex items-center justify-center p-5'>
    <div className='min-h-screen bg-blue-100 p-5 shadow-[0_3px_10px_rgb(0,0,0,0.2)]'>
      <div className='flex'>
        <img src={file} alt="file-img" className='pl-4 pt-4 h-16' />
        <p className='pt-4 pl-6 font-semibold text-4xl'>Review Requests</p>

      </div>
    <div>
      {/* Pending Requests Section */}
      <div className=" pt-5 pl-5">
        <div className="flex items-center space-x-2 font-semibold mb-4">
          <img src={dot} alt="three-dots" />
          <p>Pending Requests</p>
        </div>
        <div className="">
          {pendingRequests.map((request) => (
            <AdminViewCard
              key={request.id}
              id={request.id}
              heading={request.heading}
              infotext={request.infotext}
              points_requested={request.points_requested}
              dept={request.dept}
              user={request.userid}
              link={request.link}
              status={request.status}
              onUpdateStatus={updateStatus} // Pass status update function
            />
          ))}
        </div>
      </div>

      {/* Completed Requests Section */}
      <div>
        <div className="flex items-center space-x-2 font-semibold mb-4">
          <img src={tick} alt="tick-mark" />
          <p>Completed Requests</p>
        </div>
        <div className="">
          {completedRequests.map((request) => (
            <AdminViewCard
            key={request.id}
            id={request.id}
            heading={request.heading}
            infotext={request.infotext}
            points_requested={request.points_requested}
            dept={request.dept}
            user={request.userid}
            link={request.link}
            status={request.status}
            onUpdateStatus={updateStatus}
            />
          ))}
        </div>
      </div>
    </div></div></div>
  );
}

export default AdminView;
