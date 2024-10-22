import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useRunningContext } from '../contexts/RunningContext';

function UploadDetails() {
  const { baseURL, currentUser, handleError, token } = useRunningContext();

  const [departments, setDepartments] = useState([]);
  const [leads, setLeads] = useState([]);

  const [club, setClub] = useState('codechefvitc');
  const [department, setDepartment] = useState('');
  const [lead, setLead] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [links, setLinks] = useState(['']);
  const [points, setPoints] = useState(0);
  const [customPoints, setCustomPoints] = useState('');
  const [multiplier, setMultiplier] = useState(1);

  const [loadingDepartments, setLoadingDepartments] = useState(true);
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [availablePoints, setAvailablePoints] = useState([]);
  const [error, setError] = useState('');

  const departmentPoints = {
    smandc: [
      {
        label: 'Technical Writing for CodeChef Newsletter - 3 Points/Publish',
        value: 3,
      },
      {
        label: 'Providing Reel Script that gets implemented - 4 Points/Reel',
        value: 4,
      },
      { label: 'Acting in Reels - 5 Points/Reel', value: 5 },
      {
        label: 'Resharing Reels (claim within 24 hours) - 1 Point/Reel',
        value: 1,
      },
    ],
    design: [
      { label: 'Poster Design - 7 Points/Accepted Poster', value: 7 },
      { label: 'Story Design - 7 points/Accepted Story', value: 7 },
    ],
    mands: [
      {
        label:
          'Offline Event Registrations (Referral) - 2 Points/Reg (max 20 Points/event)',
        value: 2,
      },
      {
        label:
          'Online Event Registrations (Referral) - 1 Point/Reg (max 5 Points/event)',
        value: 1,
      },
      {
        label: 'Participation in Physical/ Hostel Marketing - 8 Points/session',
        value: 8,
      },
      { label: 'Cold Mails to Sponsors - 1 Point/2 Mails', value: 1 },
    ],
    cp: [
      { label: 'Attending Weekly Online Discussions - 1 Point/Meet', value: 1 },
      {
        label: 'Attempting Online CodeChef Contest - 3 Points/Contest',
        value: 3,
      },
      {
        label: 'Attempting Weekly Tasks/ Questions - 2 Points/Que Solved',
        value: 2,
      },
    ],
    em: [
      { label: 'Registration Desk - 10 Points', value: 10 },
      { label: 'Disciplinary Committee - 10 Points', value: 10 },
      { label: 'Backstage duty -10 Points', value: 10 },
      { label: 'Entry/Exit duty -10 Points', value: 10 },
      { label: 'Miscellaneous Management Tasks (Will be notified)', value: 0 }, // value 0 means to be notified
    ],
    clubleads: [
      { label: 'Attending events - 4 Points/Event (min 4 events)', value: 4 },
      { label: 'Attending FFCS meets - 1 Point/meet (mandatory)', value: 1 },
    ],
  };

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
        if (response.status === 403) {
          handleError('Fetching departments', deps.error);
          return;
        }

        if (response.status === 200) {
          setDepartments(deps);
          setLoadingDepartments(false);
          setLoadingLeads(true);
        }
      } catch (error) {
        console.log('Error in upload page: ', error);
      }
    };
    fetchDepartments();
  }, [baseURL, handleError]);

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
        handleError('fetching Leads', error);
      }
    };
    if (department) {
      fetchLeads();
    }
  }, [department, baseURL, handleError]);

  const handleDepartmentChange = (e) => {
    setDepartment(e.target.value);
    setLead('');
    setLeads([]);
    setPoints('');
    setAvailablePoints(departmentPoints[e.target.value] || []);
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
    if (points === '') {
      toast.error('Please select the points requested!');
      return;
    }

    if (department === '') {
      toast.error('Please select the department!');
      return;
    }

    if (lead === '') {
      console.log('here');
      toast.error('Please select the lead!');
      return;
    }

    const pointsToSubmit = points === 'custom' ? customPoints : points;
    const totalPoints = pointsToSubmit * multiplier;

    try {
      const response = await fetch(`${baseURL}/contApi/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title,
          points: totalPoints,
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
      if (response.status === 403) {
        handleError('Submitting request', data.error);
        return;
      }
    } catch (error) {
      handleError('Details uploading', error);
      return;
    }

    toast.success('Request submitted successfully!');

    setDepartment('');
    setLead('');
    setTitle('');
    setDescription('');
    setLinks(['']);
    setPoints('');
    setCustomPoints('');
    setMultiplier(1);
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
            Proof Files (Upload files to your google drive and paste link to the
            file here):
          </label>
          {links.map((link, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="url"
                value={link}
                onChange={(e) => handleLinkChange(index, e)}
                className="block w-full p-2 border border-gray-300 rounded-md"
              />
              {links.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeLink(index)}
                  className="ml-2 text-red-500 hover:text-red-700"
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
            + Add Another Link
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Points Requested:
          </label>

          <select
            // value={points}
            onChange={(e) => {
              if (e.target.value != '' && e.target.value != 'custom') {
                setPoints(availablePoints[e.target.value].value);
              } else {
                setPoints(e.target.value);
              }
            }}
            className="block w-full p-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Select Points</option>
            {availablePoints.map((pointOption, index) => (
              <option key={index} value={index}>
                {pointOption.label}
              </option>
            ))}
            <option value="custom">Custom Points</option>
          </select>
          {points == 'custom' ? (
            <div className="mt-2">
              <label className="block text-sm font-medium mb-1">
                Points Requested:
              </label>
              <input
                type="number"
                value={customPoints}
                onChange={(e) => setCustomPoints(Number(e.target.value))}
                className="block w-full p-2 border border-gray-300 rounded-md"
                min="1"
                required
              />
            </div>
          ) : (
            <div className="mt-2">
              <label className="block text-sm font-medium mb-1">
                How many times did you complete this task?
              </label>
              <input
                type="number"
                value={multiplier}
                onChange={(e) => setMultiplier(Number(e.target.value))}
                className="block w-full p-2 border border-gray-300 rounded-md"
                min="1"
                required
              />
            </div>
          )}
        </div>

        <div>
          <button
            type="submit"
            className="block w-full p-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600"
          >
            Submit Request
          </button>
        </div>
      </form>
    </div>
  );
}

export default UploadDetails;
