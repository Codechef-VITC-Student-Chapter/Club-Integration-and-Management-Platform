import { Task } from "./schemas";

export interface FullTask {
  task: Task;
  club_name?: string;
  department_name?: string;
  created_by_user?: string;
}

export interface TasksResponse {
  message: string;
  tasks: FullTask[];
}

export interface TaskInfo {
  title: string;
  points: number;
  club_id: string;
  department_id: string;
  created_by: string;
}

export interface TaskUpdateInfo {
  title?: string;
  points?: number;
  club_id?: string;
  department_id?: string;
  is_active?: boolean;
}

export interface AddTaskResponse {
  message: string;
  task_id: string;
}
