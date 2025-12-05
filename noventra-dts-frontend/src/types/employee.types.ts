// src/types/employee.types.ts

export type EmployeeRole =
  | "Super Admin"
  | "Admin"
  | "Manager"
  | "Staff";

export type EmploymentType =
  | "Full-time"
  | "Part-time"
  | "Contract"
  | "Intern";

export type WorkMode = "WFO" | "WFH" | "Hybrid";

export type AccountStatus = "Active" | "Invited" | "Suspended";

export interface Employee {
  id: string;
  code: string; 
  name: string;
  email: string;
  role: EmployeeRole;
  department: string;
  employmentType: EmploymentType;
  workMode: WorkMode;
  phone?: string;
  location?: string; // city / office
  timezone?: string;
  avatarColor?: string;
  lastLoginAt?: string;
  createdAt: string;
  status: AccountStatus;
}
