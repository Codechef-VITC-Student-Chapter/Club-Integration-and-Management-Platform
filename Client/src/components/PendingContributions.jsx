import React from 'react';
import TaskComponent from './TaskCard'; // Assuming TaskCard is in the same directory

function PendingContributions({ pendingContributions }) {
  return (
    <div className="space-y-2 flex flex-col md:flex-row gap-8 items-center">
      {pendingContributions.length === 0 ? (
        <p>No pending contributions.</p>
      ) : (
        pendingContributions.map((contribution) => (
          <TaskComponent
          key={contribution.cont_id}
          taskName={contribution.title} // Match the prop name expected in TaskComponent
          target={contribution.target}   // Match the prop name expected in TaskComponent
          department={contribution.dep}   // Match the prop name expected in TaskComponent
          date={contribution.created_at}  // Match the prop name expected in TaskComponent
          description={contribution.desc} // Match the prop name expected in TaskComponent
          id={contribution.cont_id}       // Assuming you want to pass the ID as well
          points={contribution.points}     // Match the prop name expected in TaskComponent
          status={contribution.status}     // Match the prop name expected in TaskComponent
        />
        ))
      )}
    </div>
  );
}

export default PendingContributions;
