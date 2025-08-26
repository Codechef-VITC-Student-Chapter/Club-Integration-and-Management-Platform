// Club Types - Mirrors Go club_types.go

import { Club, User, Department } from "./schemas";

export interface ClubInfoResponse {
  message: string;
  club: Club;
}

export interface AllClubMembersResponse {
  message: string;
  members: User[];
}

export interface AllClubDepartmentsResponse {
  message: string;
  departments: Department[];
}
