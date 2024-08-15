import React from 'react';
import TaskCard from './TaskCard'; // Assuming TaskCard is in the same directory

function PendingContributions({ pendingContributions }) {
  return (
    <div className="space-y-2">
      {pendingContributions.length === 0 ? (
        <p>No pending contributions.</p>
      ) : (
        pendingContributions.map((contribution) => (
          <TaskCard
            key={contribution.title}
            title={contribution.title}
            description={contribution.description}
            club={contribution.club}
            department={contribution.department}
            lead={contribution.lead}
            date={contribution.date}
          />
        ))
      )}
    </div>
  );
}

export default PendingContributions;
