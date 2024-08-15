import React, { useState, useEffect } from 'react';

function UploadDetails() {
  // Simulated data
  const clubsData = {
    club1: { id: 'club1', name: 'Club 1' },
    club2: { id: 'club2', name: 'Club 2' },
    club3: { id: 'club3', name: 'Club 3' },
  };

  const departmentsData = {
    club1: {
      department1: { id: 'department1', name: 'Department 1' },
      department2: { id: 'department2', name: 'Department 2' },
    },
    club2: {
      department3: { id: 'department3', name: 'Department 3' },
      department4: { id: 'department4', name: 'Department 4' },
    },
    club3: {
      department5: { id: 'department5', name: 'Department 5' },
      department6: { id: 'department6', name: 'Department 6' },
    },
  };

  const leadsData = {
    department1: [
      { id: 'lead1', name: 'Lead 1' },
      { id: 'lead2', name: 'Lead 2' },
    ],
    department2: [
      { id: 'lead3', name: 'Lead 3' },
      { id: 'lead4', name: 'Lead 4' },
    ],
    department3: [
      { id: 'lead5', name: 'Lead 5' },
      { id: 'lead6', name: 'Lead 6' },
    ],
    department4: [
      { id: 'lead7', name: 'Lead 7' },
      { id: 'lead8', name: 'Lead 8' },
    ],
    department5: [
      { id: 'lead9', name: 'Lead 9' },
      { id: 'lead10', name: 'Lead 10' },
    ],
    department6: [
      { id: 'lead11', name: 'Lead 11' },
      { id: 'lead12', name: 'Lead 12' },
    ],
  };

  const [clubs, setClubs] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [leads, setLeads] = useState([]);

  const [club, setClub] = useState('');
  const [department, setDepartment] = useState('');
  const [lead, setLead] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [links, setLinks] = useState(['']);

  const [loadingClubs, setLoadingClubs] = useState(true);
  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Simulate API call to fetch clubs
    const fetchClubs = async () => {
      setLoadingClubs(true);
      try {
        setTimeout(() => {
          setClubs(Object.values(clubsData));
          setLoadingClubs(false);
        }, 1000); // Simulate delay
      } catch (err) {
        setError('Failed to load clubs.');
        setLoadingClubs(false);
      }
    };

    fetchClubs();
  }, []);

  useEffect(() => {
    if (club) {
      // Simulate API call to fetch departments based on selected club
      const fetchDepartments = async () => {
        setLoadingDepartments(true);
        try {
          setTimeout(() => {
            setDepartments(Object.values(departmentsData[club] || {}));
            setLoadingDepartments(false);
          }, 1000); // Simulate delay
        } catch (err) {
          setError('Failed to load departments.');
          setLoadingDepartments(false);
        }
      };

      fetchDepartments();
    }
  }, [club]);

  useEffect(() => {
    if (department) {
      // Simulate API call to fetch leads based on selected department
      const fetchLeads = async () => {
        setLoadingLeads(true);
        try {
          setTimeout(() => {
            setLeads(leadsData[department] || []);
            setLoadingLeads(false);
          }, 1000); // Simulate delay
        } catch (err) {
          setError('Failed to load leads.');
          setLoadingLeads(false);
        }
      };

      fetchLeads();
    }
  }, [department]);

  const handleClubChange = (e) => {
    setClub(e.target.value);
    setDepartment('');
    setLead('');
    setDepartments([]);
    setLeads([]);
  };

  const handleDepartmentChange = (e) => {
    setDepartment(e.target.value);
    setLead('');
    setLeads([]);
  };

  const handleLinkChange = (index, event) => {
    const newLinks = links.slice();
    newLinks[index] = event.target.value;
    setLinks(newLinks);
  };

  const addLink = () => {
    setLinks([...links, '']);
  };

  const removeLink = (index) => {
    const newLinks = links.filter((_, i) => i !== index);
    setLinks(newLinks);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const requestData = {
      club,
      department,
      lead,
      title,
      description,
      links,
    };
    console.log('Data to be sent to API:', requestData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Submit a Request</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div>
          <label className="block text-sm font-medium mb-1">Club:</label>
          {loadingClubs ? (
            <p>Loading clubs...</p>
          ) : (
            <select
              value={club}
              onChange={handleClubChange}
              className="block w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select Club</option>
              {clubs.map((club) => (
                <option key={club.id} value={club.id}>
                  {club.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Department:</label>
          {loadingDepartments ? (
            <p>Loading departments...</p>
          ) : (
            <select
              value={department}
              onChange={handleDepartmentChange}
              className="block w-full p-2 border border-gray-300 rounded-md"
              disabled={!club}
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Lead:</label>
          {loadingLeads ? (
            <p>Loading leads...</p>
          ) : (
            <select
              value={lead}
              onChange={(e) => setLead(e.target.value)}
              className="block w-full p-2 border border-gray-300 rounded-md"
              disabled={!department}
            >
              <option value="">Select Lead</option>
              {leads.map((lead) => (
                <option key={lead.id} value={lead.id}>
                  {lead.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Links:</label>
          {links.map((link, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                value={link}
                onChange={(e) => handleLinkChange(index, e)}
                className="block w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter link"
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeLink(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addLink}
            className="text-blue-500 hover:text-blue-700"
          >
            Add Another Link
          </button>
        </div>

        <button
          type="submit"
          className="block w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
        >
          Submit Request
        </button>
      </form>
    </div>
  );
}

export default UploadDetails;
