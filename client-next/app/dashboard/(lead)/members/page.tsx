"use client";

import React, { useState, useMemo } from "react";
import SidebarWrapper from "@/components/layouts/sidebar/sidebar-wrapper";
import { useGetAllClubMembersQuery } from "@/lib/redux/api";
import { club_id } from "@/lib/keys";

const MembersPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [pointsFilter, setPointsFilter] = useState("0-500");
  const [statusFilter, setStatusFilter] = useState("Active");


  // Fetch members from backend
  const { data, isLoading, error } = useGetAllClubMembersQuery(club_id);
  // Map API data to UI shape
  const members = useMemo(() => {
    if (!data || !data.members) return [];
    return data.members.map((m) => ({
      id: m.id,
      name: `${m.first_name} ${m.last_name}`,
      department: m.departments && m.departments.length > 0 ? m.departments[0] : "",
      registerNumber: m.reg_number,
      points: m.total_points,
      status: m.locked_till && new Date(m.locked_till) > new Date() ? "Inactive" : "Active",
      lastUpdated: m.last_updated ? m.last_updated.replace("T", " ").slice(0, 16) : "",
      avatar: undefined, // You can add avatar logic if available in API
    }));
  }, [data]);

  const q = searchQuery.trim().toLowerCase();
  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      q === "" ||
      member.name.toLowerCase().includes(q) ||
      member.registerNumber.toLowerCase().includes(q);
    const matchesDepartment =
      !departmentFilter || member.department === departmentFilter;
    const matchesStatus = statusFilter ? member.status === statusFilter : true;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  return (
    <SidebarWrapper pageTitle="Members">
      {/* Root is a column flex so header (fixed) + main (flex-1) stack properly.
          min-h-0 everywhere that can shrink so overflow works and no extra gaps appear. */}
      <div
  className="w-full flex-1 min-h-0 flex flex-col m-0 p-0 font-sans bg-[#f7f8fa]"
      >

        {/* header area (fixed height) */}
        <div className="flex items-center w-full bg-white px-6 py-4 shadow-sm border-b border-gray-200">
          <h1 className="font-semibold text-lg text-[#0f172a]">CodeChef VIT-C – Admin</h1>
          <div className="ml-auto flex items-center gap-3">
            <button
              className="text-[#0f172a] bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-600"
              type="button"
            >
              Toggle Theme
            </button>
            <button
              className="inline-flex items-center gap-2 bg-[#2563eb] hover:bg-[#1e40af] text-white font-semibold text-sm rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-600"
              type="button"
            >
              <i className="fas fa-user-plus" /> Add Member
            </button>
          </div>
        </div>

        {/* main grows to fill remaining viewport; min-h-0 lets children shrink correctly */}
        <main className="flex-1 w-full min-h-0 m-0 p-0">
          <div className="contentInner flex flex-col h-full min-h-0 px-6 pt-6 pb-6">
            <section className="flex-none">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="font-bold text-xl text-[#0f172a] mb-1">All Members</h2>
                  <p className="text-xs text-[#64748b] font-semibold uppercase tracking-wide">
                    Total Members: 98
                  </p>
                </div>

                {/* Bulk Actions with icon */}
                <button
                  type="button"
                  className="inline-flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2 text-sm font-semibold text-[#475569] hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-600"
                >
                  <i className="fas fa-list-ul" /> Bulk Actions
                </button>
              </div>

              {/* Filter row — distributes inputs evenly across full width */}
              <div className="filters w-full mb-4">
                <div className="w-full flex flex-wrap items-center gap-3">
                  <input
                    className="flex-1 min-w-[160px] rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-[#475569] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="Search..."
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <input
                    className="flex-1 min-w-[160px] rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-[#475569] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="Department"
                    type="text"
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                  />
                  <input
                    className="flex-1 min-w-[160px] rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-[#475569] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="Points: 0–500"
                    type="text"
                    value={pointsFilter}
                    onChange={(e) => setPointsFilter(e.target.value)}
                  />
                  <select
                    aria-label="Status"
                    className="flex-1 min-w-[160px] rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-[#475569] focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="Active">Status: Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="">All</option>
                  </select>
                  <button
                    className="flex-none rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-[#64748b] hover:bg-gray-100 hover:text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-1"
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setDepartmentFilter("");
                      setPointsFilter("0-500");
                      setStatusFilter("Active");
                    }}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </section>

            {/* Table wrapper: flex-1 + min-h-0 so it actually shrinks and becomes the scroll viewport.
                Footer is sticky inside this viewport and will sit flush at the bottom. */}
            <div
              className="overflow-auto flex-1 min-h-0 rounded-xl shadow-lg border border-gray-200 bg-white"
            >
              <div className="flex flex-col min-h-full">
                <table className="w-full text-left text-sm text-[#0f172a] border-collapse flex-1">
                  <thead className="bg-[#f1f5f9] text-[#475569] font-semibold sticky top-0 z-20">
                    <tr>
                      <th className="px-4 py-3 border-b border-gray-200 w-[320px]">Member Name</th>
                      <th className="px-4 py-3 border-b border-gray-200 w-[160px]">Register Number</th>
                      <th className="px-4 py-3 border-b border-gray-200 w-[80px]">Points</th>
                      <th className="px-4 py-3 border-b border-gray-200 w-[180px]">Last Updated <i className="fas fa-sort ml-1 text-[#94a3b8]" /></th>
                      <th className="border-b border-gray-200 w-[48px]" />
                    </tr>
                  </thead>

                  <tbody>
                    {filteredMembers.map((member, index) => (
                      <tr
                        key={member.id}
                        className={`${index % 2 === 0 ? "bg-[#ebf3ff]" : "bg-white"} hover:bg-[#e6edf7] cursor-pointer`}
                        onDoubleClick={() => {
                          // Go to /dashboard/members/[id]
                          window.location.href = `/dashboard/members/UID${member.registerNumber}`;
                        }}
                      >
                        <td className="px-4 py-3 align-middle">
                          <div className="flex items-center gap-3">
                            <img
                              alt={member.avatar ? `Profile picture of ${member.name}` : "Profile picture of Dumb Member"}
                              className="rounded-full w-10 h-10 object-cover flex-shrink-0"
                              src={
                                member.avatar ||
                                "https://storage.googleapis.com/a1aa/image/ef2a5769-b8b9-4bbf-8779-36e90218ac46.jpg"
                              }
                              width="40"
                              height="40"
                            />
                            <div className="flex flex-col">
                              <span className="text-[#0f172a] font-semibold text-sm leading-5">
                                {member.name}
                                <span className={`ml-2 inline-block text-white text-[10px] font-semibold rounded-full px-2 py-[2px] align-middle select-none ${member.status === "Active" ? "bg-[#2563eb]" : "bg-gray-500"}`}>
                                  {member.status}
                                </span>
                              </span>
                              <span className="text-[#94a3b8] text-[10px] font-semibold uppercase leading-4">{member.department}</span>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3 align-middle font-semibold">{member.registerNumber}</td>
                        <td className="px-4 py-3 align-middle font-semibold">{member.points}</td>
                        <td className="px-4 py-3 align-middle font-semibold">{member.lastUpdated}</td>
                        <td className="px-4 py-3 align-middle text-center cursor-pointer text-[#475569] hover:text-[#0f172a]"><i className="fas fa-ellipsis-h" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* sticky pagination/footer inside the scroll viewport */}
                <div className="sticky bottom-0 z-30 w-full px-4 py-3 border-t border-gray-200 bg-[#f1f5f9] mt-auto">
                  <div className="max-w-full flex flex-wrap justify-end items-center gap-3">
                    <div className="flex items-center gap-2 border border-gray-300 rounded-full px-3 py-1 bg-white">
                      <span className="w-3 h-3 rounded-full bg-[#22c55e] inline-block" />
                      <span>Rows: 12</span>
                    </div>

                    <div className="text-xs font-semibold text-[#94a3b8]">1–12 of 98</div>

                    <div className="flex gap-2">
                      <button aria-label="Page 1" className="w-8 h-8 rounded-full border border-gray-300 bg-white text-[#94a3b8] hover:text-[#0f172a] hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-1" type="button">1</button>
                      <button aria-label="Page 2" className="w-8 h-8 rounded-full border border-gray-300 bg-white text-[#94a3b8] hover:text-[#0f172a] hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-1" type="button">2</button>
                      <button aria-label="Page 3" className="w-8 h-8 rounded-full border border-gray-300 bg-white text-[#94a3b8] hover:text-[#0f172a] hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-1" type="button">3</button>
                      <button aria-label="Page 4" className="w-8 h-8 rounded-full border border-gray-300 bg-white text-[#94a3b8] hover:text-[#0f172a] hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-1" type="button">4</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* end contentInner */}
          </div>
        </main>
      </div>

      <style jsx>{`
        /* scrollbar styling scoped to the overflow wrapper */
        :global(.overflow-auto)::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        :global(.overflow-auto)::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 9999px;
        }
        :global(.overflow-auto)::-webkit-scrollbar-thumb {
          background-color: #94a3b8;
          border-radius: 9999px;
          border: 2px solid #f1f5f9;
        }

        /* ensure html/body margins are zero (covers browser defaults) */
        :global(html, body) {
          margin: 0;
          padding: 0;
          height: 100%;
        }
      `}</style>
    </SidebarWrapper>
  );
};

export default MembersPage;