import React from 'react';
import TaskComponent from './components/TaskComponent';
import { BsGlobe } from "react-icons/bs";

const DepartmentContributions = () => {
    const contributions = [
        {
            id: 1,
            taskName: "Event Organization",
            target: "Annual Tech Fest",
            department: "Operations",
            date: "2024-08-15",
            description: "Managed annual tech fest with 500+ participants.",
            points: 50,
            status: "Pending"
          },
          {
            id: 2,
            taskName: "Research & Development",
            target: "AI-Based Attendance System",
            department: "R&D",
            date: "2024-09-10",
            description: "Developed AI-based attendance system.",
            points: 70,
            status: "Accepted"
          },
          {
            id: 3,
            taskName: "Community Outreach",
            target: "Coding Workshops",
            department: "Education",
            date: "2024-07-25",
            description: "Conducted 10+ coding workshops for students.",
            points: 40,
            status: "Rejected"
          }
    ];

    return (
        <div className="min-h-screen bg-[#e8f1fe] p-6">
            <div className="flex justify-between items-center border-b-2 border-gray-300 pb-4">
            <h1 className="text-3xl font-semibold text-[#2E3446] flex items-center gap-2"> 
              <BsGlobe/> Web Development
            </h1>
                <div className="bg-[#2E3446] text-white px-4 py-2 rounded-xl">Member Name: <span className="font-bold">23XXX1000</span></div>
            </div>
            <p className="mt-2 text-lg font-medium">Points: <span className="font-bold">100</span> | <span className="font-bold">6 Contributions</span></p>
            <div className="grid md:grid-cols-3 gap-6 mt-6">
        {contributions.map((contribution, index) => (
          <TaskComponent
            target={contribution.target}
            department={contribution.department}
            key={contribution.id}
            date={contribution.date}
            description={contribution.description || "No description available"}
            id={contribution.id}
            points={contribution.points}
            taskName={contribution.taskName}
            status={contribution.status}
          />
        ))}
      </div>
    </div>
    );
};

export default DepartmentContributions;