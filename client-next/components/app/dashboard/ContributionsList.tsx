"use client";

import { useState, useMemo } from "react";
import {
  ChevronDown,
  Search,
  List,
  LayoutGrid,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { DashboardContribution } from "@/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// Single contribution item (list/card style)
const ContributionItem = ({
  contribution,
  view,
}: {
  contribution: DashboardContribution;
  view: string;
}) => {
  if (contribution.contribution.status === "pending") return null;

  const borderColor =
    contribution.contribution.status.toLowerCase() === "approved"
      ? "border-green-200"
      : "border-red-200";

  const badgeColor =
    contribution.contribution.status.toLowerCase() === "approved"
      ? "bg-green-600"
      : "bg-red-600";

  return view === "list" ? (
    <Card className={`mb-3 border-2 ${borderColor}`}>
      <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4">
        <div className="flex-grow">
          <h4 className="font-bold text-gray-800">
            {contribution.contribution.title}
          </h4>
          <p className="text-sm text-gray-600">
            {contribution.contribution.description}
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-500 mt-2 w-full sm:w-auto flex-wrap">
            <span>{contribution.contribution.user_id}</span>
            <span>•</span>
            <span>{contribution.contribution.department}</span>
            <span>•</span>
            <span>
              {new Date(
                contribution.contribution.created_at
              ).toLocaleDateString()}
            </span>
            <span>•</span>
            <span className="font-semibold text-gray-600">
              {contribution.contribution.id}
            </span>
          </div>
        </div>
        <div className="flex-shrink-0">
          <span
            className={`text-white text-sm font-bold w-8 h-8 flex items-center justify-center rounded-full ${badgeColor}`}
          >
            {contribution.contribution.points}
          </span>
        </div>
      </CardContent>
    </Card>
  ) : (
    <Card className={`relative border-2 ${borderColor}`}>
      <CardContent className="p-4 flex flex-col items-start min-w-[10rem] max-h-52">
        <h4 className="font-bold text-gray-800 text-md truncate w-full">
          {contribution.contribution.title}
        </h4>
        <p className="text-sm text-gray-600 mb-2">
          {contribution.contribution.description}
        </p>
        <span className="text-xs text-gray-500">
          {contribution.contribution.department}
        </span>
        <span
          className={`absolute bottom-3 right-3 text-white text-sm font-bold w-8 h-8 flex items-center justify-center rounded-full ${badgeColor}`}
        >
          {contribution.contribution.points}
        </span>
      </CardContent>
    </Card>
  );
};

interface ContributionsListProps {
  contributions: DashboardContribution[];
}

export const ContributionsList: React.FC<ContributionsListProps> = ({
  contributions,
}) => {
  const [view, setView] = useState<"list" | "cards">("list");
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("All");

  const ITEMS_PER_PAGE = view === "list" ? 4 : 6;

  const departments = [
    "All",
    ...new Set(contributions.map((c) => c.contribution.department)),
  ];

  const filteredContributions = useMemo(() => {
    return contributions.filter((c) => {
      const matchesDept =
        selectedDepartment === "All" ||
        c.contribution.department === selectedDepartment;
      const matchesSearch =
        c.contribution.title.toLowerCase().includes(search.toLowerCase()) ||
        c.contribution.description.toLowerCase().includes(search.toLowerCase());
      return matchesDept && matchesSearch;
    });
  }, [contributions, selectedDepartment, search]);

  const totalPages = Math.ceil(filteredContributions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentContributions = filteredContributions.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  if (!contributions || contributions.length === 0) {
    return (
      <Card className="mt-6">
        <CardContent className="bg-gray-50 p-4 rounded-lg text-center text-gray-500">
          No contributions found.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <CardTitle className="text-xl font-bold">Contributions</CardTitle>
      </CardHeader>

      <CardContent>
        {/* Contributions */}
        <div
          className={`p-4 rounded-lg min-h-[25rem] ${
            view === "cards"
              ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
              : "space-y-3"
          } overflow-y-auto max-h-[40rem]`}
        >
          {currentContributions.map((contribution) => (
            <ContributionItem
              key={contribution.contribution.id}
              contribution={contribution}
              view={view}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
