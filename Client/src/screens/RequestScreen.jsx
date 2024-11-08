import React, { useState } from 'react';
import Navbar from '../components/Navbar';

const EditLinks = ({ isOpen, onClose, links, setLinks }) => {
  if (!isOpen) return null;

  const addNewLink = () => {
    setLinks([...links, '']);
  };

  const updateLink = (index, value) => {
    const newLinks = [...links];
    newLinks[index] = value;
    setLinks(newLinks);
  };

  const removeLink = (index) => {
    const newLinks = links.filter((_, i) => i !== index);
    setLinks(newLinks);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-blue-500">Edit Links</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="space-y-3">
          {links.map((link, index) => (
            <div key={index} className="relative">
              <input
                type="text"
                value={link}
                onChange={(e) => updateLink(index, e.target.value)}
                placeholder={`Link${index + 1}`}
                className="w-full p-2 pr-8 border rounded"
              />
              <button
                onClick={() => removeLink(index)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={addNewLink}
          className="mt-4 text-blue-500 hover:text-blue-600 flex items-center gap-1"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          ADD ANOTHER LINK
        </button>
      </div>
    </div>
  );
};

const RequestScreen = () => {
  const [isELopen, setisELopen] = useState(false);
  const [links, setLinks] = useState(['']);
  const [club, setClub] = useState(null); //newly added
  const id = "102";
  const baseURL = 'http://localhost:3000';

  //to get the club details - newly added
  useEffect(() => {
    const fetchClubDetails = async () => {
      try {
        const response = await fetch(`${baseURL}/clubApi/get/${id}`);
        if (!response.ok) throw new Error('Failed to fetch club details');
        const data = await response.json();
        console.log(club);
        setClub(data);
      } catch (error) {
        console.error('Error fetching club details:', error);
      }
    };

    fetchClubDetails();
  }, []);


  return (
    <div className="min-h-screen p-5">
      
      <div className="bg-[#E9F1FE] min-h-screen pt-4">
        <h1 className="text-center text-2xl py-4">SUBMIT A REQUEST</h1>

        <div className="mx-4 md:mx-auto max-w-4xl">
          <div className="bg-white rounded-3xl p-6 shadow-md">
            <form>
              <div className="mb-4">
                Club: <b>{club?.clubName || 'Loading...'}</b>
              </div>

              <div className="mb-4">
                <label className="block mb-2">Lead:</label>
                <div className="relative">
                  <select className="w-full p-2 rounded border appearance-none bg-white pr-8">
                    <option>Select Lead</option>
                    {club?.clubLeads.map((lead, index) => (
                      <option key={index}>{lead}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="block mb-2">Department:</label>
                <div className="relative">
                  <select className="w-full p-2 rounded border appearance-none bg-white pr-8">
                    <option>Select Department</option>
                    {club?.clubDeps.map((department, index) => (
                      <option key={index}>{department}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="block mb-2">Title:</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    placeholder="Contributed this during that"
                    className="w-full p-2 pl-8 rounded border"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block mb-2">Description:</label>
                <textarea
                  rows="4"
                  placeholder="I did this and that, completed that, and helped club get much more successful with everything"
                  className="w-full p-2 rounded border resize-none"
                ></textarea>
              </div>

              <div className="mb-4">
                <label className="block mb-2">Proof Files(upload files to your google drive and paste link to the file here):</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    value={links[0] || ''}
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
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Edit Links
                </button>
              </div>

              <div className="mb-4">
                <label className="block mb-2">Points Requested:</label>
                <div className="relative">
                  <select className="w-full p-2 rounded border appearance-none bg-white pr-8">
                    <option>Select Points</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block mb-2">How many times did you complete this task?</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    placeholder="Text field data"
                    className="w-full p-2 pl-8 rounded border"
                  />
                </div>
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