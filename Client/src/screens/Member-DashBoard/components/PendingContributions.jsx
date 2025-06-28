import TaskComponent from "../../../components/TaskComponent"; // Assuming TaskCard is in the same directory
import faceicon from "../../../assets/empty-box.png";

function PendingContributions({ pendingContributions }) {
  return pendingContributions.length === 0 ? (
    <div className="flex justify-center items-center flex-col h-full">
      <img src={faceicon} alt="" />
      No pending contributions.
    </div>
  ) : (
    <div className="flex flex-col md:flex-row gap-8 items-center overflow-scroll">
      {pendingContributions.map((contribution) => (
        <TaskComponent
          key={contribution.cont_id}
          taskName={contribution.title} // Match the prop name expected in TaskComponent
          target={contribution.target} // Match the prop name expected in TaskComponent
          department={contribution.department} // Match the prop name expected in TaskComponent
          date={contribution.created_at} // Match the prop name expected in TaskComponent
          description={contribution.description} // Match the prop name expected in TaskComponent
          reason={contribution.reason}
          id={contribution.id} // Assuming you want to pass the ID as well
          points={contribution.points} // Match the prop name expected in TaskComponent
          status={contribution.status} // Match the prop name expected in TaskComponent
        />
      ))}
    </div>
  );
}

export default PendingContributions;
