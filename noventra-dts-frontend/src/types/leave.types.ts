// src/types/leave.types.ts
export type LeaveStatus = "Pending" | "Approved" | "Rejected" | "Cancelled";
export type LeaveType =
  | "Casual"
  | "Sick"
  | "Privilege"
  | "Unpaid"
  | "Work From Home";

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  department: string;
  role: string;

  type: LeaveType;
  status: LeaveStatus;

  startDate: string;   // "2025-12-05"
  endDate: string;     // "2025-12-07"
  days: number;

  reason?: string;
  approver?: string;
  createdAt: string;   // ISO string
  updatedAt?: string;
}
