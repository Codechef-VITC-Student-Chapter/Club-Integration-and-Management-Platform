import React from "react";
import TaskComponent from "./TaskComponent"; // Assuming TaskCard is in the same directory

function PendingContributions({ pendingContributions }) {
  return (
    <div className="flex flex-col md:flex-row gap-8 items-center overflow-scroll">
      {pendingContributions.length === 0 ? (
        <p>No pending contributions.</p>
      ) : (
        pendingContributions.map((contribution) => (
          <TaskComponent
            key={contribution.cont_id}
            taskName={contribution.title} // Match the prop name expected in TaskComponent
            target={contribution.target} // Match the prop name expected in TaskComponent
            department={contribution.department_name} // Match the prop name expected in TaskComponent
            date={contribution.created_at} // Match the prop name expected in TaskComponent
            description={contribution.description} // Match the prop name expected in TaskComponent
            id={contribution.id} // Assuming you want to pass the ID as well
            points={contribution.points} // Match the prop name expected in TaskComponent
            status={contribution.status} // Match the prop name expected in TaskComponent
          />
        ))
      )}
    </div>
  );
}

export default PendingContributions;
