import React from "react";
import TaskComponent from "./TaskComponent"; // Adjusting import path to match actual component name

function RecentContributions({ contributions }) {
  return contributions.length === 0 ? (
    <p>No recent contributions.</p>
  ) : (
    <div className="flex flex-col md:flex-row gap-8 items-center justify-center overflow-scroll">
      {contributions.map((contribution) => (
        <TaskComponent
          key={contribution.id}
          taskName={contribution.title} // Match the prop name expected in TaskComponent
          target={contribution.target} // Match the prop name expected in TaskComponent
          department={contribution.department} // Match the prop name expected in TaskComponent
          date={contribution.created_at} // Match the prop name expected in TaskComponent
          description={contribution.description} // Match the prop name expected in TaskComponent
          id={contribution.id} // Assuming you want to pass the ID as well
          points={contribution.points} // Match the prop name expected in TaskComponent
          status={contribution.status} // Match the prop name expected in TaskComponent
        />
      ))}
    </div>
  );
}

export default RecentContributions;
