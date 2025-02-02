import { useState, useEffect, useContext } from "react";
import EditLinks from "../components/EditLinks.jsx";
import { toast } from "react-toastify";
import { useRunningContext } from "../contexts/RunningContext.jsx";

const RequestScreen = () => {
  const { baseURL, currentUser, token } = useRunningContext();
  const [isELopen, setisELopen] = useState(false);
  const [links, setLinks] = useState([""]);
  const [club, setClub] = useState(null);
  const [deps, setDeps] = useState([]);
  const [leads, setLeads] = useState([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [depChosen, setDepChosen] = useState("");
  const [target, setTarget] = useState("");
  const [availablePoints, setAvailablePoints] = useState([]);
  const [selectedPoints, setSelectedPoints] = useState(0); // For points dropdown
  const [customPoints, setCustomPoints] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [choseCustom, setChoseCustom] = useState(false);
  const id = "codechefvitcc";

  const departmentPoints = {
    smandc: [
      {
        label: "Technical Writing for CodeChef Newsletter - 3 Points/Publish",
        value: 3,
      },
      {
        label: "Providing Reel Script that gets implemented - 4 Points/Reel",
        value: 4,
      },
      { label: "Acting in Reels - 5 Points/Reel", value: 5 },
      {
        label: "Resharing Reels (claim within 24 hours) - 1 Point/Reel",
        value: 1,
      },
    ],
    design: [
      { label: "Poster Design - 7 Points/Accepted Poster", value: 7 },
      { label: "Story Design - 7 points/Accepted Story", value: 7 },
    ],
    mands: [
      {
        label:
          "Offline Event Registrations (Referral) - 2 Points/Reg (max 20 Points/event)",
        value: 2,
      },
      {
        label:
          "Online Event Registrations (Referral) - 1 Point/Reg (max 5 Points/event)",
        value: 1,
      },
      {
        label: "Participation in Physical/ Hostel Marketing - 8 Points/session",
        value: 8,
      },
      { label: "Cold Mails to Sponsors - 1 Point/2 Mails", value: 1 },
    ],
    cp: [
      { label: "Attending Weekly Online Discussions - 1 Point/Meet", value: 1 },
      {
        label: "Attempting Online CodeChef Contest - 3 Points/Contest",
        value: 3,
      },
      {
        label: "Attempting Weekly Tasks/ Questions - 2 Points/Que Solved",
        value: 2,
      },
    ],
    em: [
      { label: "Registration Desk - 10 Points", value: 10 },
      { label: "Disciplinary Committee - 10 Points", value: 10 },
      { label: "Backstage duty -10 Points", value: 10 },
      { label: "Entry/Exit duty -10 Points", value: 10 },
      { label: "Miscellaneous Management Tasks (Will be notified)", value: 0 },
    ],
    clubleads: [
      { label: "Attending events - 4 Points/Event (min 4 events)", value: 4 },
      { label: "Attending FFCS meets - 1 Point/meet (mandatory)", value: 1 },
    ],
  };

  useEffect(() => {
    const fetchClubDetails = async () => {
      try {
        console.log("Fetching Club Details");
        const response = await fetch(`${baseURL}/clubApi/get/${id}`);
        if (!response.ok) throw new Error("Failed to fetch club details");
        const data = await response.json();
        setClub(data);
      } catch (error) {
        console.error("Error fetching club details:", error);
      }
    };
    fetchClubDetails();
  }, []);

  useEffect(() => {
    const fetchDepsDetails = async () => {
      if (!club) return;
      try {
        const response = await fetch(`${baseURL}/clubApi/get-departments`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            clubId: club.id,
          }),
        });
        if (!response.ok) throw new Error("Failed to fetch deps details");
        const data = await response.json();
        setDeps(data);
      } catch (error) {
        console.error("Error fetching club details:", error);
      }
    };
    fetchDepsDetails();
  }, [club]);

  const getDepartmentLeads = async (e) => {
    try {
      const dep_id = e.target.value;
      setDepChosen(dep_id);
      setAvailablePoints(departmentPoints[dep_id] || []);
      console.log("Fetching Department Leads");
      const response = await fetch(`${baseURL}/depsApi/get-leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          depId: dep_id,
        }),
      });
      if (!response.ok) throw new Error("Failed to fetch dep_leads details");
      const data = await response.json();
      setLeads(data);
      // console.log(data);
      setAvailablePoints(departmentPoints[dep_id]);
    } catch (error) {
      console.error("Error fetching club details:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPoints && !choseCustom) {
      toast.warn("Please select the points requested!");
      return;
    }

    if (!depChosen) {
      toast.warn("Please select the department!");
      return;
    }
    if (!target) {
      toast.warn("Please select the lead");
      return;
    }

    const finalPoints = !choseCustom
      ? selectedPoints * multiplier
      : Number(customPoints);

    try {
      const response = await fetch(`${baseURL}/contApi/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: currentUser,
          title: title,
          points: finalPoints,
          description: desc,
          proof_files: links,
          target,
          club_id: club.id,
          department: depChosen,
          status: "pending",
          created_at: Date.now(),
        }),
      });

      if (!response.ok) {
        // console.log(response);
        toast.error("Failed to submit the request");
        return;
      }
      toast.success("Request submitted successfully!");

      // Reset form
      setTitle("");
      setDesc("");
      setLinks([""]);
      setSelectedPoints("");
      setCustomPoints("");
      setMultiplier(1);
      setChoseCustom(false);
    } catch (error) {
      console.error("Error submitting request:", error);
      toast.error("Error submitting request");
    }
  };

  return (
    <div className="min-h-screen p-5">
      <div className="bg-[#E9F1FE] min-h-screen pt-4">
        <h1 className="text-center text-2xl py-4">SUBMIT A REQUEST</h1>

        <div className="mx-4 md:mx-auto max-w-4xl">
          <div className="bg-white rounded-3xl p-6 shadow-md">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                Club: <b>{club?.name || "Loading..."}</b>
              </div>
              <div className="mb-4">
                <label className="block mb-2">Department:</label>
                <div className="relative">
                  <select
                    className="w-full p-2 rounded border appearance-none bg-white pr-8"
                    onChange={getDepartmentLeads}
                    value={depChosen}
                  >
                    <option value="">Select Department</option>
                    {deps?.map((data, index) => (
                      <option key={index} value={data.id}>
                        {data.name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <label className="block mb-2">Lead:</label>
                <div className="relative">
                  <select
                    className="w-full p-2 rounded border appearance-none bg-white pr-8"
                    disabled={!depChosen}
                    onChange={(e) => {
                      setTarget(e.target.value);
                    }}
                  >
                    <option value="">Select Lead</option>
                    {leads.map((data, index) => (
                      <option key={index} value={data.user_id}>
                        {data.name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <label className="block mb-2">Title:</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                    <svg
                      className="w-4 h-4 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </span>
                  <input
                    type="text"
                    placeholder="Contributed this during that"
                    className="w-full p-2 pl-8 rounded border"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block mb-2">Description:</label>
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  rows="4"
                  placeholder="I did this and that, completed that, and helped club get much more successful with everything"
                  className="w-full p-2 rounded border resize-none"
                  required
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block mb-2">
                  Proof Files(upload files to your google drive and paste link
                  to the file here):
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                    <svg
                      className="w-4 h-4 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                      />
                    </svg>
                  </span>
                  <input
                    type="text"
                    value={links[0] || ""}
                    onChange={(e) => {
                      const newLinks = [...links];
                      newLinks[0] = e.target.value;
                      setLinks(newLinks);
                    }}
                    placeholder="https://drive.google.com/file/d/1Y8N..."
                    className="w-full p-2 pl-8 rounded border"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setisELopen(true)}
                  className="text-blue-500 text-sm mt-1 flex items-center gap-1"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                  Edit Links
                </button>
              </div>
              <div className="mb-4 flex flex-col gap-3">
                <div className="relative">
                  <label className="block mb-2">Points Requested:</label>
                  <select
                    className="w-full p-2 rounded border appearance-none bg-white pr-8"
                    disabled={!depChosen}
                    onChange={(e) => {
                      if (e.target.value === "-1") {
                        setChoseCustom(true);
                        return;
                      } else setChoseCustom(false);
                      setSelectedPoints(e.target.value);
                      setCustomPoints(0);
                    }}
                  >
                    <option value="">Select Points</option>
                    {availablePoints &&
                      availablePoints.map((pointOption, index) => (
                        <option key={index} value={pointOption.value}>
                          {pointOption.label}
                        </option>
                      ))}
                    <option value="-1">Custom Points</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
                {choseCustom && (
                  <div className="flex flex-col gap-2">
                    <label className="">Custom Points: </label>
                    <input
                      type="number"
                      value={customPoints}
                      onChange={(e) => setCustomPoints(e.target.value)}
                      placeholder="Enter custom points"
                      className="w-full p-2 rounded border"
                      min="1"
                      required
                    />
                  </div>
                )}
              </div>
              {!choseCustom && selectedPoints !== 0 && (
                <div className="mb-6">
                  <label className="block mb-2">
                    How many times did you complete this task?
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                      <svg
                        className="w-4 h-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                        />
                      </svg>
                    </span>
                    <input
                      type="number"
                      value={multiplier}
                      onChange={(e) => setMultiplier(Number(e.target.value))}
                      placeholder="Enter what is asked"
                      className="w-full p-2 pl-8 rounded border"
                      min="1"
                      required
                    />
                  </div>
                </div>
              )}
              <button
                type="submit"
                className="w-full bg-[#4285F4] text-white py-3 rounded-lg hover:bg-blue-600 transition-colors"
              >
                SUBMIT REQUEST
              </button>
            </form>
          </div>
        </div>
      </div>

      <EditLinks
        isOpen={isELopen}
        onClose={() => setisELopen(false)}
        links={links}
        setLinks={setLinks}
      />
    </div>
  );
};

export default RequestScreen;
