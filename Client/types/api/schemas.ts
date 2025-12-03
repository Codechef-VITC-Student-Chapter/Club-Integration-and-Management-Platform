// Database Schema Types - Mirrors Go schemas

export interface User {
  id: string;
  reg_number: string;
  first_name: string;
  last_name: string;
  email: string;
  otp?: string;
  otp_retries?: number;
  locked_till: string; // ISO date string
  password: string;
  is_lead: boolean;
  departments?: string[];
  clubs?: string[];
  contributions?: string[];
  handles?: string[];
  total_points: number;
  last_updated: string; // ISO date string
}

export interface Club {
  id: string;
  name: string;
  leads: string[];
  departments?: string[];
}

export interface Department {
  id: string;
  name: string;
  club_id: string;
  leads: string[];
  sub_departments: string[];
  tasks: string[];
}

export type Status = "pending" | "approved" | "rejected";

export interface Contribution {
  id: string;
  title: string;
  points: number;
  user_id: string;
  description: string;
  proof_files?: string[];
  target: string;
  secTargets?: string[];
  club_id: string;
  department: string;
  status: Status;
  reason?: string;
  created_at: string; // ISO date string
}

export interface Task {
  id: string;
  club_id: string;
  department_id: string;
  title: string;
  points: number;
  created_by: string;
  is_active: boolean;
}

export interface FullContribution {
  contribution: Contribution;
  club_name: string;
  department_name: string;
  user_name: string; // Submitted user name
  lead_user_names: string[]; // Array of all lead user names (target + secTargets)
}
