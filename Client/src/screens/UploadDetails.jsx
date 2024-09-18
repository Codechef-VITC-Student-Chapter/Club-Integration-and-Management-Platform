import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useRunningContext } from '../contexts/RunningContext';

function UploadDetails() {
  const { baseURL, currentUser, handleError } = useRunningContext();

  const [departments, setDepartments] = useState([]);
  const [leads, setLeads] = useState([]);

  const [club, setClub] = useState('codechefvitc');
  const [department, setDepartment] = useState('');
  const [lead, setLead] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [links, setLinks] = useState(['']);
  const [points, setPoints] = useState('');

  const [loadingDepartments, setLoadingDepartments] = useState(true);
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch(`${baseURL}/clubApi/get-departments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ club_id: 'codechefvitc' }),
        });
        const deps = await response.json();
        console.log(deps[0]);
        setDepartments(deps);
        setLoadingDepartments(false);
        setLoadingLeads(true);
      } catch (error) {
        console.log('Error in upload page: ', error);
      }
    };
    fetchDepartments();
  }, []);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await fetch(`${baseURL}/depsApi/getLeads`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ dep_id: department }),
        });
        const decodeLeads = await response.json();
        setLeads(decodeLeads);
        setLoadingLeads(false);
      } catch (error) {
        console.log('Error while fetching leads: ', error);
      }
    };
    if (department != '') {
      fetchLeads();
    }
  }, [department]);

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

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Send API call where we create the new contribution request

    try {
      const response = await fetch(`${baseURL}/contApi/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title,
          points: points,
          user: currentUser,
          desc: description,
          proof_files: links,
          target: lead,
          club: club,
          dep: department,
          status: 'pending',
          created_at: Date.now(),
        }),
      });

      const data = await response.json();
      if (response.status == 403) {
        handleError('Fetching contributions', data.error);
        return;
      }
    } catch (error) {
      handleError('Details uploading', error);
      return;
    }

    toast.success('Request submitted successfully!');

    setClub('');
    setDepartment('');
    setLead('');
    setTitle('');
    setDescription('');
    setLinks(['']);
    setPoints('');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Submit a Request</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div>
          <label className="block text-sm font-medium mb-1">Club:</label>
          <p className="font-bold">CodeChef VIT-C</p>
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
                <option key={lead.user_id} value={lead.user_id}>
                  {lead.first_name} {lead.last_name}
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
          <label className="block text-sm font-medium mb-1">
            Points Requested:
          </label>
          <input
            type="number"
            value={points}
            onChange={(e) => setPoints(e.target.value)}
            className="block w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter points"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Links to proof (upload your files to google drive and post the view
            link to it here if required):
          </label>
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
