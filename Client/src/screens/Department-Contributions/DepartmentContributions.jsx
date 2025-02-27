import TaskComponent from "../Member-DashBoard/components/TaskComponent"

const DepartmentContributions = () => {
    const contributions = [
        {
            "id": "CID22DUM12341737042980386",
            "title": "Hdsjnakf",
            "points": 1231231,
            "user": "UID22DUM1234",
            "description": "jksdnklafd",
            "proof_files": [""],
            "target": "UID23BAI6969",
            "club": "codechefvitcc",
            "department": "webdevelopment",
            "status": "rejected",
            "created_at": "2025-01-16T15:56:20.367Z",
            "club_name": "CodeChef VIT-C"
        },
        {
            "id": "CID22DUM12341737042980386",
            "title": "Hdsjnakf",
            "points": 1231231,
            "user": "UID22DUM1234",
            "description": "jksdnklafd",
            "proof_files": [""],
            "target": "UID23BAI6969",
            "club": "codechefvitcc",
            "department": "webdevelopment",
            "status": "rejected",
            "created_at": "2025-01-16T15:56:20.367Z",
            "club_name": "CodeChef VIT-C"
        },
        {
            "id": "CID22DUM12341737042980386",
            "title": "Hdsjnakf",
            "points": 1231231,
            "user": "UID22DUM1234",
            "description": "jksdnklafd",
            "proof_files": [""],
            "target": "UID23BAI6969",
            "club": "codechefvitcc",
            "department": "webdevelopment",
            "status": "rejected",
            "created_at": "2025-01-16T15:56:20.367Z",
            "club_name": "CodeChef VIT-C"
        },
        {
            "id": "CID22DUM12341737042980386",
            "title": "Hdsjnakf",
            "points": 1231231,
            "user": "UID22DUM1234",
            "description": "jksdnklafd",
            "proof_files": [""],
            "target": "UID23BAI6969",
            "club": "codechefvitcc",
            "department": "webdevelopment",
            "status": "rejected",
            "created_at": "2025-01-16T15:56:20.367Z",
            "club_name": "CodeChef VIT-C"
        },
        {
            "id": "CID22DUM12341737042980387",
            "title": "Bug Fix Contribution",
            "points": 500,
            "user": "UID22DUM5678",
            "description": "Fixed a critical security vulnerability.",
            "proof_files": ["fix_patch.png"],
            "target": "UID23BAI7001",
            "club": "codechefvitcc",
            "department": "cybersecurity",
            "status": "approved",
            "created_at": "2025-02-01T10:20:15.120Z",
            "club_name": "CodeChef VIT-C"
        },
        {
            "id": "CID22DUM12341737042980388",
            "title": "AI Model Implementation",
            "points": 2000,
            "user": "UID22DUM9101",
            "description": "Developed an AI model for handwritten digit recognition.",
            "proof_files": ["model_accuracy.pdf"],
            "target": "UID23BAI7050",
            "club": "ai_club_vitcc",
            "department": "machinelearning",
            "status": "pending",
            "created_at": "2025-02-05T18:45:30.567Z",
            "club_name": "AI Club VIT-C"
        },
        {
            "id": "CID22DUM12341737042980389",
            "title": "Open Source Contribution",
            "points": 1500,
            "user": "UID22DUM1122",
            "description": "Contributed to an open-source blockchain project.",
            "proof_files": ["github_commit_log.txt"],
            "target": "UID23BAI7105",
            "club": "oss_club_vitcc",
            "department": "blockchain",
            "status": "approved",
            "created_at": "2025-02-10T12:00:45.890Z",
            "club_name": "Open Source Club VIT-C"
        },
        {
            "id": "CID22DUM12341737042980390",
            "title": "UI/UX Design for App",
            "points": 750,
            "user": "UID22DUM3344",
            "description": "Designed a mobile app UI for a college event.",
            "proof_files": ["ui_mockup.png"],
            "target": "UID23BAI7150",
            "club": "design_club_vitcc",
            "department": "uiux",
            "status": "pending",
            "created_at": "2025-02-15T09:30:10.234Z",
            "club_name": "Design Club VIT-C"
        },
        {
            "id": "CID22DUM12341737042980391",
            "title": "Database Optimization",
            "points": 1800,
            "user": "UID22DUM5566",
            "description": "Optimized a large-scale SQL database to improve query efficiency.",
            "proof_files": ["query_performance_report.pdf"],
            "target": "UID23BAI7200",
            "club": "data_club_vitcc",
            "department": "databases",
            "status": "approved",
            "created_at": "2025-02-20T14:15:55.678Z",
            "club_name": "Data Science Club VIT-C"
        }
    ]


    return (
        <div className="flex flex-col gap-5 h-[91.4vh] w-full overflow-hidden">
            <div className="bg-[#E9F0FA] px-4 md:px-10 pt-6">
                <div className="max-w-6xl mx-auto">
                    {/* Title - Points Summary */}
                    <div className="flex items-center text-black text-xl md:text-2xl font-bold">
                        {/* <FaCoins className="mr-2 text-black" /> */}
                        Web Development
                    </div>

                    {/* Total Points + Member Box */}
                    <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mt-7">
                        {/* Total Points */}
                        <p className="text-md md:text-lg text-black font ml-8">
                            Total Points: <span className="font">100 | 6 Contributions</span>
                        </p>

                        {/* Member Box (Position Adjusted) */}
                        <div className="bg-[#1E1E1E] text-white py-3 px-10 flex items-center rounded-md w-full md:w-96 h-14 justify-between mt-4 md:mt-0">
                            <span className="font-bold text-md md:text-lg">Member name</span>
                            <div className="h-10 w-0.5 bg-gray-400 mx-4"></div>
                            <span className="font-bold text-md md:text-lg">23XXX1000</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="h-full w-full overflow-scroll flex p-5">
                {
                    contributions.length === 0 ? (
                        <p>No recent contributions.</p>
                    ) : (
                        <div className="flex flex-wrap md:flex-row gap-8 items-center justify-center overflow-scroll">
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
                    )
                }
            </div>
        </div>
    )
}
export default DepartmentContributions