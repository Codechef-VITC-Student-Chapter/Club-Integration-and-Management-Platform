
"use client";
import React, { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { useGetUserContributionsQuery, useGetUserInfoQuery, useUpdateContributionDetailsMutation } from "@/lib/redux/api";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import dayjs from "dayjs";
import SidebarWrapper from "@/components/layouts/sidebar/sidebar-wrapper";
import { departmentMap } from "@/lib/keys";

const DEPT_TABS = [
  { key: "all", label: "All" },
  { key: "webdev", label: "Web Development" },
  { key: "cp", label: "Competitive Programming" },
  { key: "em", label: "Events Management" },
  { key: "clubleads", label: "Club Leads" },
  { key: "smandc", label: "Social Media" },
  { key: "mands", label: "Marketing and Sponsorship" },
  { key: "design", label: "Design" },
];


import type { FullContribution } from "@/types/api/schemas";

const IndividualMemberContributionsPage = () => {
  const params = useParams();
  const userId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const [activeTab, setActiveTab] = useState("all");
  const [selectedContribution, setSelectedContribution] = useState<FullContribution | null>(null);
  const [showAddPoints, setShowAddPoints] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    points: "",
    description: "",
    department: "",
  });
  const [tabHover, setTabHover] = useState<string | null>(null);
  const [updateContribution, { isLoading: isUpdating, isError: isUpdateError, isSuccess: isUpdateSuccess, error: updateError }] = useUpdateContributionDetailsMutation();
  const [updateMsg, setUpdateMsg] = useState<string>("");

  const { data: userInfo } = useGetUserInfoQuery(userId || "");
  const { data, isLoading, error } = useGetUserContributionsQuery(userId || "");
  const contributions = useMemo(() => data?.contributions || [], [data]);

  // Filter contributions by department key
  const filteredContributions = useMemo(() => {
    if (activeTab === "all") return contributions;
    return contributions.filter(
      (c) => c.contribution.department?.toLowerCase() === activeTab
    );
  }, [contributions, activeTab]);

  // Get member name and regno
  const memberName = userInfo?.user ? `${userInfo.user.first_name} ${userInfo.user.last_name}` : "";
  const regno = userInfo?.user?.reg_number || "";

  return (
    <SidebarWrapper pageTitle="Member Contributions">
      <div className="flex flex-col gap-6 p-6">
        <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-blue-50 to-white shadow-xl rounded-2xl border-0 p-0 overflow-hidden">
          <div className="flex flex-col items-center py-8 px-6">
            <div className="relative mb-4">
              <img
                src={
                  (userInfo?.user && 'profile_pic' in userInfo.user && (userInfo.user as any).profile_pic)
                    ? (userInfo.user as any).profile_pic
                    : 'https://storage.googleapis.com/a1aa/image/ef2a5769-b8b9-4bbf-8779-36e90218ac46.jpg'
                }
                alt="Profile"
                className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg bg-gray-100"
                onError={e => { e.currentTarget.src = 'https://storage.googleapis.com/ezap-prod/club/default_profile.png'; }}
              />
              <span className="absolute bottom-2 right-2 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></span>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#2563eb] mb-1">{memberName}</div>
              <div className="text-sm text-gray-500 font-semibold tracking-wide bg-blue-100 rounded-full px-4 py-1 inline-block">{regno}</div>
            </div>
          </div>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-wrap gap-2 mb-6 justify-center">
            {DEPT_TABS.map((tab) => (
              <button
                key={tab.key}
                className={`relative px-5 py-2 rounded-xl font-semibold text-base transition-all duration-200 capitalize
                  ${activeTab === tab.key
                    ? 'bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-lg scale-105'
                    : 'bg-[#f7f8fa] text-[#2563eb] border border-blue-100 hover:bg-blue-50 hover:scale-105'}
                  ${tabHover === tab.key ? 'ring-2 ring-blue-200' : ''}
                `}
                style={{ minWidth: 140 }}
                onClick={() => setActiveTab(tab.key)}
                onMouseEnter={() => setTabHover(tab.key)}
                onMouseLeave={() => setTabHover(null)}
              >
                {tab.label}
                {activeTab === tab.key && (
                  <span className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-blue-500 to-blue-300 rounded-full" />
                )}
              </button>
            ))}
          </div>

          {DEPT_TABS.map((tab) => (
            <TabsContent key={tab.key} value={tab.key} className="w-full">
              <div className="grid gap-4">
                {isLoading && <div>Loading...</div>}
                {error && <div className="text-red-500">Error loading contributions.</div>}
                {!isLoading && filteredContributions.length === 0 && (
                  <div className="text-gray-500">No contributions found.</div>
                )}
                {!isLoading && filteredContributions.length > 0 && (
                  <div className="grid gap-4">
                    {filteredContributions.map((c) => (
                      <Card key={c.contribution.id} className="hover:shadow-lg transition cursor-pointer">
                        <CardHeader className="flex flex-row items-center justify-between">
                          <CardTitle className="text-base font-semibold">
                            {c.contribution.title}
                          </CardTitle>
                          <span className="text-xs font-semibold rounded-full px-2 py-1 bg-blue-100 text-blue-700">
                            {departmentMap[c.contribution.department?.toLowerCase() as keyof typeof departmentMap] || c.department_name || c.contribution.department}
                          </span>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-2">
                          <div className="text-sm text-gray-700">{c.contribution.description}</div>
                          <div className="flex gap-4 items-center mt-2">
                            <span className="text-xs text-gray-500">Points: <span className="font-bold text-blue-600">{c.contribution.points}</span></span>
                            <span className="text-xs text-gray-500">Status: <span className="font-bold capitalize">{c.contribution.status}</span></span>
                            <button
                              className="text-[#2563eb] border border-[#2563eb] rounded-md px-3 py-1 text-xs font-semibold hover:bg-[#2563eb] hover:text-white transition"
                              onClick={() => {
                                setSelectedContribution(c);
                                setForm({
                                  title: c.contribution.title || "",
                                  points: "",
                                  description: c.contribution.description || "",
                                  department: c.contribution.department || "",
                                });
                                setShowAddPoints(true);
                              }}
                            >
                              Add Points
                            </button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Custom Add Points Modal */}
        {showAddPoints && (
          <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-[6px] bg-black/10">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 border border-gray-100 relative animate-fadein">
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#2563eb] text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg border-4 border-white text-3xl">
                <i className="fas fa-plus" />
              </div>
              <div className="flex flex-col items-center mb-6 mt-8">
                <div className="font-bold text-xl text-[#0f172a] mb-1">Add Points</div>
                <div className="text-sm text-[#64748b] font-semibold">{memberName} — {regno}</div>
                <div className="text-xs text-[#64748b] font-semibold">{departmentMap[form.department?.toLowerCase() as keyof typeof departmentMap] || form.department}</div>
              </div>
              <form
                onSubmit={e => {
                  e.preventDefault();
                  setShowAddPoints(false);
                  setShowConfirm(true);
                }}
                className="flex flex-col gap-4"
              >
                <div className="flex flex-col gap-4 bg-[#f7f8fa] rounded-lg p-4 border border-gray-100 mb-2">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-[#475569] w-28">Title:</span>
                    <span className="text-[#0f172a] font-semibold break-all flex-1">{form.title}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-[#475569] w-28">Department:</span>
                    <span className="text-[#0f172a] font-semibold break-all flex-1">{departmentMap[form.department?.toLowerCase() as keyof typeof departmentMap] || form.department}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="font-semibold text-[#475569] w-28 pt-1">Description:</span>
                    <span className="text-[#0f172a] whitespace-pre-line break-words flex-1">{form.description}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1 mb-2">
                  <label className="block text-xs font-semibold text-[#475569] mb-1">Points</label>
                  <input
                    type="number"
                    min={0}
                    className="w-full rounded-lg border border-blue-200 bg-white px-4 py-2 text-lg text-[#2563eb] font-bold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent shadow-sm"
                    placeholder="Points"
                    value={form.points}
                    onChange={e => setForm(f => ({ ...f, points: e.target.value }))}
                    required
                  />
                </div>
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    type="button"
                    className="rounded-lg border border-gray-300 bg-white px-5 py-2 text-base font-semibold text-[#64748b] hover:bg-gray-100 hover:text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-1 shadow-sm"
                    onClick={() => setShowAddPoints(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 bg-[#2563eb] hover:bg-[#1e40af] text-white font-bold text-base rounded-lg px-6 py-2 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-600 shadow-md"
                  >
                    Next
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Custom Confirmation Modal */}
        {showConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-[6px] bg-black/10">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 border border-gray-200">
              <div className="font-semibold text-lg text-[#0f172a] mb-2">Confirm your action</div>
              <div className="bg-[#f7f8fa] rounded-lg p-4 mb-4 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-[#475569]">Task Title</span>
                  <span className="text-[#0f172a] font-semibold">{form.title}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-[#475569]">Target Member</span>
                  <span className="text-[#0f172a] font-semibold">UID: {regno}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-[#475569]">Name</span>
                  <span className="text-[#0f172a] font-semibold">{memberName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-[#475569]">Department</span>
                  <span className="text-[#0f172a] font-semibold">{departmentMap[form.department?.toLowerCase() as keyof typeof departmentMap] || form.department}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-[#475569]">Date</span>
                  <span className="text-[#0f172a] font-semibold">{dayjs().format("YYYY-MM-DD")}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-[#475569]">Task Description</span>
                  <span className="text-[#0f172a]">{form.description}</span>
                </div>
                <div className="flex flex-col items-center mt-2">
                  <span className="font-semibold text-[#475569] mb-1">Points</span>
                  <span className="rounded-full bg-[#2563eb] text-white text-2xl font-bold w-16 h-16 flex items-center justify-center border-4 border-[#ebf3ff]">{form.points}</span>
                </div>
              </div>
              {updateMsg && (
                <div className={`mb-2 text-center font-semibold ${isUpdateError ? 'text-red-500' : 'text-green-600'}`}>{updateMsg}</div>
              )}
              <div className="flex justify-end gap-2 mt-2">
                <button
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-[#64748b] hover:bg-gray-100 hover:text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-1"
                  onClick={() => {
                    setShowConfirm(false);
                    setShowAddPoints(true);
                  }}
                  disabled={isUpdating}
                >
                  Cancel
                </button>
                <button
                  className="inline-flex items-center gap-2 bg-[#2563eb] hover:bg-[#1e40af] text-white font-semibold text-sm rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-600 disabled:opacity-60"
                  disabled={isUpdating}
                  onClick={async () => {
                    if (!selectedContribution || !form.points || isNaN(Number(form.points))) {
                      setUpdateMsg('Invalid points value.');
                      return;
                    }
                    setUpdateMsg('');
                    try {
                      await updateContribution({
                        cont_id: selectedContribution.contribution.id,
                        user_id: userId || "",
                        points: Number(form.points),
                      }).unwrap();
                      setUpdateMsg('Points added successfully!');
                      setTimeout(() => {
                        setShowConfirm(false);
                        setForm({ title: "", points: "", description: "", department: "" });
                        setSelectedContribution(null);
                        setUpdateMsg("");
                      }, 1200);
                    } catch (err) {
                      setUpdateMsg('Failed to add points.');
                    }
                  }}
                >
                  {isUpdating ? 'Adding...' : 'Add'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </SidebarWrapper>
  );
};

export default IndividualMemberContributionsPage;
