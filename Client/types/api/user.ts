// User Types - Mirrors Go user_types.go

import { User } from "./schemas";
import { FullContribution } from "./schemas";

export interface GetUserResponse {
  message: string;
  user?: User;
}

export interface GetUserContributionsResponse {
  message: string;
  contributions: FullContribution[];
}

export interface GetLeadUserRequestsResponse {
  message: string;
  requests: FullContribution[];
}

export interface MakeUserLeadResponse {
  message: string;
}

export interface UploadMembersHandlesInfo {
  lead_user_id: string;
  csv_file: File; // In TypeScript, we use File for file uploads
}

export interface CSVUserData {
  Dept: string;
  RollNo: string;
  Name: string;
  CodeChef: string;
  CodeForces: string;
  LeetCode: string;
  Other: string;
  Analytics: string;
}
