import React from 'react';
import PropTypes from 'prop-types';

function AdminViewCard({ request, onUpdateStatus }) {
  const handleApprove = () => {
    onUpdateStatus(request.id, 'approved');
  };

  const handleDeny = () => {
    onUpdateStatus(request.id, 'denied');
  };

  const handleChangeStatus = () => {
    onUpdateStatus(request.id, 'default');
  };

  const backgroundColor =
    request.status === 'approved' ? 'bg-[#9FEFA8]' : request.status === 'denied' ? 'bg-[#F4AAAA]' : 'bg-white';

  const borderColor =
    request.status === 'approved' ? 'border-green-900 border-2' : request.status === 'denied' ? 'border-red-900 border-2' : 'border-black';

  return (
    <div
      className={`w-[99%] max-w-full p-6 rounded-3xl shadow-2xl border-[2px] ${borderColor} transition-colors duration-300 ${backgroundColor}`}
    >
      <div className="flex flex-col md:flex-row justify-between">
        {/* Main Content Section */}
        <div className="mb-4 md:mb-0">
          <div className="text-[14px] font-mono mb-4 text-black">Request ID: {request.id}</div>
          <h1 className="text-[20px] md:text-[22px] font-bold mb-2 text-black">{request.heading}</h1>
          <p className="text-[16px] text-black max-w-md mb-2">{request.infotext}</p>
        </div>

        {/* Align points, department, and user horizontally with even space */}
        <div className="flex flex-wrap md:flex-nowrap justify-between items-center gap-6 text-[16px] font-bold text-black mb-6 w-full">
          <p className="flex-1 text-center">Points Requested: {request.points_requested}</p>
          <p className="flex-1 text-center">Department: {request.dept}</p>
          <p className="flex-1 text-center">User: {request.userid}</p>
        </div>
      </div>

      {/* Link and Buttons Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-6">
        <a href={request.link} className="text-blue-500 text-[16px]">
          <span className="text-black mr-2">Links:</span> {request.link}
        </a>

        <div className="flex gap-4 items-center mt-4 md:mt-0">
          {request.status === 'default' && (
            <>
              <button className="bg-[#198754] text-white px-6 py-2 rounded hover:bg-green-600" onClick={handleApprove}>
                Approve
              </button>
              <button className="bg-[#DC3545] text-white px-6 py-2 rounded hover:bg-red-600" onClick={handleDeny}>
                Deny
              </button>
            </>
          )}
          {request.status !== 'default' && (
            <>
              <button
                className={`px-6 py-2 rounded text-white transition-all duration-300 ${
                  request.status === 'approved' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                {request.status === 'approved' ? '✔ Approved' : '✘ Denied'}
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

AdminViewCard.propTypes = {
  request: PropTypes.shape({
    id: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    heading: PropTypes.string.isRequired,
    infotext: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    dept: PropTypes.string.isRequired,
    userid: PropTypes.number.isRequired,
    points_requested: PropTypes.number.isRequired,
  }).isRequired,
  onUpdateStatus: PropTypes.func.isRequired,
};

export default AdminViewCard;
 