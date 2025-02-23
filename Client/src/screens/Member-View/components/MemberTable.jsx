import { useState } from "react";
import { Search } from "lucide-react";
import styles from "../MemberView.module.css";
import { useNavigate } from "react-router-dom";

const membersData = Array.from({ length: 60 }, (_, i) => ({
    id: i + 1,
    name: `Member Name ${i + 1000}`,
    registerNumber: `23XXX10${i}0`,
    points: Math.floor(Math.random() * 500) + 100,
    lastUpdated: `10/${i + 1}/2024`,
}));

const totalcount = membersData.length;


const MemberTable = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortedField, setSortedField] = useState(null);
    const [isAscending, setIsAscending] = useState(true);
    const navigate = useNavigate();

    const sortedMembers = sortedField
        ? [...membersData].sort((a, b) => {
            return isAscending
                ? String(a[sortedField]).localeCompare(String(b[sortedField]))
                : String(b[sortedField]).localeCompare(String(a[sortedField]));
        })
        : membersData;

    const filteredMembers = sortedMembers.filter((member) =>
        Object.values(member).some((value) =>
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const handleSort = (field) => {
        if (sortedField === field) {
            if (!isAscending) {
                setSortedField(null);
            } else {
                setIsAscending(false);
            }
        } else {
            setSortedField(field);
            setIsAscending(true);
        }
    };

    return (
        <div className="min-h-screen bg-[#EAF1FD] flex justify-center items-start mt-14 px-4 py-6">
            <div className="w-full max-w-5xl">
                <h1 className="text-2xl sm:text-3xl font-bold mb-4 pt-2 text-left">
                    👥 All Members
                </h1>

                {/* Search Bar & Total Count */}
                <div className="flex flex-col sm:flex-row justify-between items-center my-4">
                    <div className="relative w-full sm:w-1/2 lg:w-1/3 mb-4 sm:mb-0">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="border p-3 w-full focus:outline-none rounded-full bg-white pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="w-4 h-4 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                    <h1 className="text-lg font-semibold text-center sm:text-right">
                        Total Members: {totalcount}
                    </h1>
                </div>

                {/* Table Header - FIXED */}
                <div className="bg-[#333333] text-white text-sm font-bold grid grid-cols-4 p-4 sticky top-0 mb-2 rounded-xl min-w-0 whitespace-nowrap">
                    <h1
                        className="text-center cursor-pointer"
                        onClick={() => handleSort("name")}
                    >
                        Member Name
                    </h1>
                    <h1
                        className="text-center cursor-pointer"
                        onClick={() => handleSort("registerNumber")}
                    >
                        Register Number
                    </h1>
                    <h1
                        className="text-center cursor-pointer"
                        onClick={() => handleSort("points")}
                    >
                        Points
                    </h1>
                    <h1
                        className="text-center cursor-pointer"
                        onClick={() => handleSort("lastUpdated")}
                    >
                        Last Updated
                    </h1>
                </div>

                {/* Member List - FIXED */}
                <div
                    className={`overflow-y-auto max-h-[440px] rounded-lg shadow-md pr-2 ${styles.scrollbarCustom}`}
                >
                    <div className="flex flex-col gap-2">
                        {filteredMembers.map((member) => (
                            <div
                                key={member.id}
                                className="bg-[#2F3445] text-white grid grid-cols-4 p-4 cursor-pointer hover:bg-gray-200 hover:text-black rounded-xl min-w-0 whitespace-nowrap"
                                onClick={() => navigate(`/points-summary/${member.id}`)}
                            >
                                <h2 className="text-center">{member.name}</h2>
                                <p className="text-center">{member.registerNumber}</p>
                                <p className="text-center font-bold">{member.points} Points</p>
                                <p className="text-center">{member.lastUpdated}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MemberTable