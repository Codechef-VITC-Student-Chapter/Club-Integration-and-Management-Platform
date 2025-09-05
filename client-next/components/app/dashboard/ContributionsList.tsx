'use client';
import { useState, useMemo } from 'react';
import { ChevronDown, Search, List, LayoutGrid, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { DashboardContribution } from '@/types'; 

// Single contribution item (list/card style)
const ContributionItem = ({ contribution, view }: { contribution: DashboardContribution; view: string }) => {
  if(contribution.contribution.status === "pending") return null; // Skip pending contributions
  return view === 'list' ? (
    <div className={`bg-white p-4 rounded-lg mb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4
    border-2 ${
      contribution.contribution.status.toLowerCase() === "approved"
        ? "border-green-200"
        : "border-red-200"
    }`}>
      <div className="flex-grow">
        <h4 className="font-bold text-gray-800">{contribution.contribution.title}</h4>
        <p className="text-sm text-gray-600">{contribution.contribution.description}</p>
        <div className="flex items-center gap-4 text-xs text-gray-500 mt-2 w-full sm:w-auto flex-wrap">
          <span>{contribution.contribution.user_id}</span>
          <span>•</span>
          <span>{contribution.contribution.department}</span>
          <span>•</span>
          <span>{new Date(contribution.contribution.created_at).toLocaleDateString()}</span>
          <span>•</span>
          <span className="font-semibold text-gray-600">{contribution.contribution.id}</span>
        </div>
      </div>
      <div className="flex-shrink-0">
        <span
          className={`text-white text-sm font-bold w-8 h-8 flex items-center justify-center rounded-full
            ${contribution.contribution.status.toLowerCase() === "approved" ? "bg-green-600" : "bg-red-600"}`}
        >
          {contribution.contribution.points}
        </span>
      </div>
    </div>
  ) : (
    <div
  className={`relative bg-white p-4 rounded-lg flex flex-col items-start min-w-[10rem] max-h-52 border-2
    ${contribution.contribution.status.toLowerCase() === "approved"
      ? "border-green-200"
      : "border-red-200"}`}
>
  {/* Title */}
  <h4 className="font-bold text-gray-800 text-md truncate w-full">
    {contribution.contribution.title}
  </h4>

  {/* Description */}
  <p className="text-sm text-gray-600 mb-2">
    {contribution.contribution.description}
  </p>

  {/* Department */}
  <span className="text-xs text-gray-500">
    {contribution.contribution.department}
  </span>

  {/* Points badge (bottom-right) */}
  <span
    className={`absolute bottom-3 right-3 text-white text-sm font-bold w-8 h-8 flex items-center justify-center rounded-full
      ${contribution.contribution.status.toLowerCase() === "approved"
        ? "bg-green-600"
        : "bg-red-600"}`}
  >
    {contribution.contribution.points}
  </span>
</div>

  );
};

interface ContributionsListProps {
  contributions: DashboardContribution[];
}

const ContributionsList: React.FC<ContributionsListProps> = ({ contributions }) => {
  const [view, setView] = useState<'list' | 'cards'>('list');
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All');

  const ITEMS_PER_PAGE = view === 'list' ? 4 : 6;

  // Extract unique departments
  const departments = ['All', ...new Set(contributions.map(c => c.contribution.department))];

  // Filter + search contributions
  const filteredContributions = useMemo(() => {
    return contributions.filter(c => {
      const matchesDept = selectedDepartment === 'All' || c.contribution.department === selectedDepartment;
      const matchesSearch =
        c.contribution.title.toLowerCase().includes(search.toLowerCase()) ||
        c.contribution.description.toLowerCase().includes(search.toLowerCase());
      return matchesDept && matchesSearch;
    });
  }, [contributions, selectedDepartment, search]);

  // Pagination
  const totalPages = Math.ceil(filteredContributions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentContributions = filteredContributions.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  if (!contributions || contributions.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm mt-6">
        <div className="bg-gray-50 p-4 rounded-lg text-center text-gray-500">
          No contributions found.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm mt-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <h3 className="text-xl font-bold text-gray-800">Contributions</h3>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Department Filter */}
          <select
            value={selectedDepartment}
            onChange={(e) => {
              setSelectedDepartment(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-gray-100 px-3 py-1.5 rounded-md text-sm"
          >
            {departments.map((dept, i) => (
              <option key={i} value={dept}>{dept}</option>
            ))}
          </select>

          {/* Search */}
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search contributions"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-gray-100 pl-10 pr-3 py-1.5 rounded-md text-sm w-48"
            />
          </div>

          {/* View toggle */}
          <div className="flex items-center border rounded-md">
            <button onClick={() => setView('list')} className={`p-1.5 ${view === 'list' ? 'bg-gray-200' : ''}`}><List size={18}/></button>
            <button onClick={() => setView('cards')} className={`p-1.5 ${view === 'cards' ? 'bg-gray-200' : ''}`}><LayoutGrid size={18}/></button>
          </div>
        </div>
      </div>

      {/* Contributions */}
      <div className={`bg-gray-50 p-4 rounded-lg min-h-[25rem] 
        ${view === 'cards' ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4' : ''}
        overflow-y-auto max-h-[40rem]`}>
        {currentContributions.map(contribution => (
          <ContributionItem key={contribution.contribution.id} contribution={contribution} view={view} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2 mt-4 text-sm">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="p-2 rounded-md hover:bg-gray-100 text-gray-500 disabled:opacity-50"
        >
          <ChevronsLeft size={16} />
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded-md ${currentPage === i + 1 ? 'bg-gray-200 font-bold text-gray-800' : 'hover:bg-gray-100 text-gray-600'}`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="p-2 rounded-md hover:bg-gray-100 text-gray-500 disabled:opacity-50"
        >
          <ChevronsRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default ContributionsList;
