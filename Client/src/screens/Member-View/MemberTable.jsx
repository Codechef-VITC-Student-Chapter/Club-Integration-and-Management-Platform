import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import styles from "./MemberView.module.css";
import { useNavigate } from "react-router-dom";
import members from "./assets/members.svg";
import { useRunningContext } from "../../contexts/RunningContext";

// const membersData = Array.from({ length: 60 }, (_, i) => ({
//   id: i + 1,
//   name: `Member Name ${i + 1000}`,
//   registerNumber: `23XXX10${i}0`,
//   points: Math.floor(Math.random() * 500) + 100,
//   lastUpdated: `10/${i + 1}/2024`,
// }));

// const totalcount = membersData.length;

const formatDate = (isoString) => {
  const date = new Date(isoString);
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();
  return `${day}-${month}-${year}`;
};

const clubId = "codechefvitc";
const MemberTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [membersData, setMembersData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const navigate = useNavigate();
  const [sortedField, setSortedField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  const handleSort = (field) => {
    setMembersData((prevData) => {
      const newSortOrder =
        sortedField === field && sortOrder === "asc" ? "desc" : "asc"; // Determine next order

      const sortedData = [...prevData].sort((a, b) => {
        let aValue = a[field];
        let bValue = b[field];

        if (typeof aValue === "string" && typeof bValue === "string") {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) return newSortOrder === "asc" ? -1 : 1;
        if (aValue > bValue) return newSortOrder === "asc" ? 1 : -1;
        return 0;
      });

      setSortedField(field);
      setSortOrder(newSortOrder);
      return sortedData;
    });
  };

  const handleSearch = () => {
    const filtered = membersData.filter((member) =>
      Object.values(member).some((value) =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredData(filtered);
  };

  useEffect(() => {
    handleSearch();
  }, [searchTerm]);

  const { baseURL, token } = useRunningContext();
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch(
          `${baseURL}/club/info/all/members/${clubId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch requests");
        const data = await response.json();
        // console.log(data.members);
        setMembersData(data.members);
        setFilteredData(data.members);
      } catch (error) {
        console.error("Error fetching requests: ", error);
      }
    };
    fetchRequests();
  }, []);

  return (
    <div className="min-h-screen bg-skyblue flex flex-col items-start px-4 py-6">
      <h1 className="text-2xl sm:text-3xl font-bold pt-2 text-left px-6 flex gap-2">
        <img src={members} alt="" className="size-8 sm:size-10" />
        All Members
      </h1>
      <div className="w-full p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center my-4">
          <div className="relative w-full sm:w-1/2 lg:w-1/3 mb-4 sm:mb-0 border-2 border-secondary rounded-full">
            <input
              type="text"
              placeholder="Search..."
              className="border p-3 w-full focus:outline-none rounded-full bg-white pl-10"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="w-4 h-4 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <h1 className="text-lg font-semibold text-center sm:text-right">
            Total Members: {membersData.length}
          </h1>
        </div>

        <div
          className={`overflow-y-auto max-h-[440px] rounded-lg shadow-md ${styles.scrollbarCustom}`}
        >
          <table className="w-full border-collapse">
            <thead className="sticky top-0">
              <tr className="bg-black text-white text-sm font-bold rounded-xl">
                <th
                  className="p-4 cursor-pointer text-center"
                  onClick={() => handleSort("first_name")}
                >
                  Member Name{" "}
                  {sortedField === "first_name" &&
                    (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th
                  className="p-4 cursor-pointer text-center"
                  onClick={() => handleSort("reg_number")}
                >
                  Register Number{" "}
                  {sortedField === "reg_number" &&
                    (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th
                  className="p-4 cursor-pointer text-center"
                  onClick={() => handleSort("total_points")}
                >
                  Points{" "}
                  {sortedField === "total_points" &&
                    (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th
                  className="p-4 cursor-pointer text-center"
                  onClick={() => handleSort("last_update")}
                >
                  Last Updated{" "}
                  {sortedField === "last_update" &&
                    (sortOrder === "asc" ? "▲" : "▼")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-[#EAF1FD]">
              {filteredData &&
                filteredData.map((member) => (
                  <tr
                    key={member.id}
                    className="bg-secondary text-white hover:bg-gray-200 hover:text-black cursor-pointer"
                    onClick={() => navigate(`/summary/${member.id}`)}
                  >
                    <td className="p-4 text-center whitespace-nowrap">
                      {member.first_name + " " + member.last_name || "-"}
                    </td>
                    <td className="p-4 text-center whitespace-nowrap">
                      {member.reg_number || "-"}
                    </td>
                    <td className="p-4 text-center whitespace-nowrap font-bold">
                      {member.total_points || "0"} Points
                    </td>
                    <td className="p-4 text-center whitespace-nowrap">
                      {member.last_updated
                        ? formatDate(member.last_updated)
                        : "-"}{" "}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MemberTable;
