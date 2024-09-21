import React from 'react';

function TaskCard({
  title,
  description,
  club,
  department,
  lead,
  date,
  status,
  points,
}) {
  const dateObj = new Date(date);

  // Determine the background color based on the status
  let bgColor;
  if (status === 'rejected') {
    bgColor = 'bg-red-200';
  } else if (status === 'approved') {
    bgColor = 'bg-green-200';
  } else if (status === 'pending') {
    bgColor = 'bg-gray-200';
  }

  return (
    <div className={`p-4 rounded-lg shadow-sm ${bgColor}`}>
      <h3 className="font-semibold text-lg mb-1">{title}</h3>
      <p className="text-sm mb-2">{description}</p>
      <p className="text-sm text-gray-600 mb-2">{points}</p>
      <p className="text-xs text-gray-600">
        Club: {club} <br />
        Department: {department} <br />
        Lead: {lead} <br />
        Date: {dateObj.toDateString()}
      </p>
    </div>
  );
}

export default TaskCard;
