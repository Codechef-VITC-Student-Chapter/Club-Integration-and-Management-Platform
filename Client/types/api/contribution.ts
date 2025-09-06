// Contribution Types - Mirrors Go cont_types.go

import { Contribution, FullContribution } from "./schemas";

export interface ContributionUpdateInfo {
  cont_id: string;
  user_id: string;
  title?: string;
  points?: number;
  description?: string;
  proof_files?: string[];
  target?: string;
  secTargets?: string[];
  department?: string;
  club_id?: string;
}

export interface CreateContributionInfo {
  title: string;
  points: number;
  user_id: string;
  description: string;
  proof_files?: string[];
  target: string;
  sec_targets?: string[];
  club_id: string;
  department: string;
}

export interface ContributionStatusInfo {
  cont_id: string;
  lead_user_id: string;
  status: string;
  reason: string;
}

export interface AddContributionIDUserInfo {
  user_id: string;
  cont_id: string;
}

export interface AddContributionResponse {
  message: string;
  cont_id: string;
}

export interface MessageResponse {
  message: string;
}
