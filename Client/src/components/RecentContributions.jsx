import React from 'react';
import TaskCard from './TaskCard'; // Assuming TaskCard is in the same directory

function RecentContributions({ contributions }) {
  return (
    <div className="space-y-2">
      {contributions.length === 0 ? (
        <p>No recent contributions.</p>
      ) : (
        contributions.map((contribution) => (
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

export default RecentContributions;
