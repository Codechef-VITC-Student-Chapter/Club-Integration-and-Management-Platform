// Club Types - Mirrors Go club_types.go

import { Club, User, Department } from "./schemas";

export interface LeaderboardEntry {
  firstname: string;
  lastname: string;
  totalPoints: number;
}

export interface ClubInfoResponse {
  message: string;
  club: Club;
}

export interface LeaderboardInfoResponse {
  message: string;
  data: LeaderboardEntry[];
}

export interface AllClubMembersResponse {
  message: string;
  members: User[];
}

export interface AllClubDepartmentsResponse {
  message: string;
  departments: Department[];
}
