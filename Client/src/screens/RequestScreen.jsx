import React, { useState, useEffect } from 'react';
import EditLinks from '../components/EditLinks.jsx';
import { useRunningContext } from '../contexts/RunningContext.jsx'; 

const RequestScreen = () => {
  const [isELopen, setisELopen] = useState(false);
  const [links, setLinks] = useState(['']);
  const [club, setClub] = useState(null);
  const [lead, setLead] = useState('');
  const [department, setDepartment] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [points, setPoints] = useState('');
  const { token, currentUser } = useRunningContext(); 
  const id = 'C001';
  const baseURL = 'http://localhost:3000';

  useEffect(() => {
    const fetchClubDetails = async () => {
      try {
        const response = await fetch(`${baseURL}/clubApi/get/${id}`);
        if (!response.ok) throw new Error('Failed to fetch club details');
        const data = await response.json();
        console.log(data.clubLeads)
        setClub(data);
      } catch (error) {
        console.error('Error fetching club details:', error);
      }
    };

    fetchClubDetails();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title,
      points: Number(points),
      userId: currentUser,
      description,
      proofFiles: links,
      target: lead,
      clubId: club.ID,
      department,
    };

    try {
      const response = await fetch(`${baseURL}/contApi/add`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit request');
      }

      window.location.replace("/")
    } catch (error) {
      console.error('Error submitting request:', error);
      alert('Failed to submit the request.');
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
                Club: <b>{club?.clubName || 'Loading...'}</b>
              </div>

              <div className="mb-4">
                <label className="block mb-2">Lead:</label>
                <div className="relative">
                  <select
                    className="w-full p-2 rounded border"
                    value={lead}
                    onChange={(e) => setLead(e.target.value)}
                  >
                    <option>Select Lead</option>
                    {club?.clubLeads && club.clubLeads.map((lead, index) => (
                      <option key={index} value={lead}>
                        {lead}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block mb-2">Department:</label>
                <div className="relative">
                  <select
                    className="w-full p-2 rounded border"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  >
                    <option>Select Department</option>
                    {club?.departments && club.departments.map((department, index) => (
                      <option key={index} value={department}>
                        {department}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block mb-2">Title:</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contributed this during that"
                  className="w-full p-2 rounded border"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2">Description:</label>
                <textarea
                  rows="4"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your contribution"
                  className="w-full p-2 rounded border"
                ></textarea>
              </div>

              <div className="mb-4">
                <label className="block mb-2">
                  Proof Files (paste Google Drive links):
                </label>
                <input
                  type="text"
                  value={links[0] || ''}
                  onChange={(e) => {
                    const newLinks = [...links];
                    newLinks[0] = e.target.value;
                    setLinks(newLinks);
                  }}
                  placeholder="https://drive.google.com/file/d/1Y8N..."
                  className="w-full p-2 rounded border"
                />
                <button
                  type="button"
                  onClick={() => setisELopen(true)}
                  className="text-blue-500 text-sm mt-1"
                >
                  Edit Links
                </button>
              </div>

              <div className="mb-4">
                <label className="block mb-2">Points Requested:</label>
                <input
                  type="number"
                  value={points}
                  onChange={(e) => setPoints(e.target.value)}
                  placeholder="Enter points"
                  className="w-full p-2 rounded border"
                />
              </div>

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
