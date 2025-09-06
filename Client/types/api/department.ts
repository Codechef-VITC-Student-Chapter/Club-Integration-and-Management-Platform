// Department Types - Mirrors Go dept_types.go

import { Department } from "./schemas";

export interface DepartmentInfoResponse {
  message: string;
  department: Department;
}

export interface LeadsInfo {
  name: string;
  user_id: string;
}

export interface DepartmentLeadsResponse {
  message: string;
  leads?: LeadsInfo[];
}
