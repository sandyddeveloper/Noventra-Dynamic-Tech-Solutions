
export interface TaskSummary {
  todo: number;
  inProgress: number;
  done: number;
}

export type ProjectStatus = "Active" | "On Hold" | "Completed" | "Archived";
export type ProjectPriority = "Low" | "Medium" | "High" | "Critical";

export interface Project {
  id: string;
  name: string;
  code: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  owner: string;     // created by
  assignee: string;  // current responsible person
  team: string[];
  startDate: string;
  dueDate: string;
  tags: string[];
  estimatedHours: number;
  loggedHours: number;
  tasks: TaskSummary;

  // extra optional metadata
  client?: string;
  isFavorite?: boolean;
}

export interface ProjectLocationState {
  employeeId?: string;
  employeeName?: string;
  employeeEmail?: string;
  filter?: string;
}
