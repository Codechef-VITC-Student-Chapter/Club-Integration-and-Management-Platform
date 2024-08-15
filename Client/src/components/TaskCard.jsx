import React from 'react';

function TaskCard({ title, description, club, department, lead, date }) {
  return (
    <div className="p-4 bg-gray-200 rounded-lg shadow-sm">
      <h3 className="font-semibold text-lg mb-1">{title}</h3>
      <p className="text-sm mb-2">{description}</p>
      <p className="text-xs text-gray-600">
        Club: {club} <br />
        Department: {department} <br />
        Lead: {lead} <br />
        Date: {date}
      </p>
    </div>
  );
}

export default TaskCard;
