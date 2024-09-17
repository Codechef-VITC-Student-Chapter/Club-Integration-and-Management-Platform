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
            key={contribution.cont_id}
            title={contribution.title}
            description={contribution.desc}
            club={contribution.club}
            department={contribution.dep}
            lead={contribution.target}
            date={contribution.created_at}
          />
        ))
      )}
    </div>
  );
}

export default PendingContributions;
