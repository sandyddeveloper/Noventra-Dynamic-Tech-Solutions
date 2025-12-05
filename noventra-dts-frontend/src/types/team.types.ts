// ------------ Types ------------
export type WorkMode = "On-site" | "Remote" | "Hybrid";
export type TeamStatus = "Active" | "Hiring" | "Paused" | "Archived";

export interface EmployeeMini {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarColor?: string;
}

export interface Team {
  id: string;
  name: string;
  code: string;
  departmentId: string;
  leadId: string;
  workMode: WorkMode;
  status: TeamStatus;
  capacity: number; 
  memberIds: string[];
  tags: string[];
}

export interface Department {
  id: string;
  name: string;
  code: string;
  headId: string;
  description?: string;
}


// ------------ Mock data ------------
export const mockEmployees: EmployeeMini[] = [
  {
    id: "emp-001",
    name: "Harini Rao",
    email: "harini.rao@example.com",
    role: "Super Admin",
    avatarColor: "#38bdf8",
  },
  {
    id: "emp-002",
    name: "Aarav Mehta",
    email: "aarav.mehta@example.com",
    role: "HR Manager",
    avatarColor: "#a855f7",
  },
  {
    id: "emp-003",
    name: "Sneha Kapoor",
    email: "sneha.kapoor@example.com",
    role: "Software Engineer",
    avatarColor: "#22c55e",
  },
  {
    id: "emp-004",
    name: "Vikram Singh",
    email: "vikram.singh@example.com",
    role: "Product Manager",
    avatarColor: "#f97316",
  },
  {
    id: "emp-005",
    name: "Nisha Gupta",
    email: "nisha.gupta@example.com",
    role: "UI/UX Designer",
    avatarColor: "#eab308",
  },
];

export const mockDepartments: Department[] = [
  {
    id: "dep-eng",
    name: "Engineering",
    code: "ENG",
    headId: "emp-003",
    description: "Product engineering, backend, frontend & architecture.",
  },
  {
    id: "dep-prod",
    name: "Product",
    code: "PROD",
    headId: "emp-004",
    description: "Product strategy, roadmaps and discovery.",
  },
  {
    id: "dep-hr",
    name: "People & HR",
    code: "HR",
    headId: "emp-002",
    description: "Hiring, culture and people operations.",
  },
];

export const mockTeams: Team[] = [
  {
    id: "team-platform",
    name: "Platform Squad",
    code: "ENG-PF",
    departmentId: "dep-eng",
    leadId: "emp-003",
    workMode: "Hybrid",
    status: "Active",
    capacity: 8,
    memberIds: ["emp-003", "emp-001"],
    tags: ["Backend", "APIs"],
  },
  {
    id: "team-web",
    name: "Web Experience",
    code: "ENG-WEB",
    departmentId: "dep-eng",
    leadId: "emp-005",
    workMode: "Remote",
    status: "Hiring",
    capacity: 6,
    memberIds: ["emp-005", "emp-001"],
    tags: ["Frontend", "Design system"],
  },
  {
    id: "team-coreprod",
    name: "Core Product",
    code: "PROD-CORE",
    departmentId: "dep-prod",
    leadId: "emp-004",
    workMode: "On-site",
    status: "Active",
    capacity: 4,
    memberIds: ["emp-004"],
    tags: ["Roadmap", "Discovery"],
  },
  {
    id: "team-peopleops",
    name: "People Ops",
    code: "HR-OPS",
    departmentId: "dep-hr",
    leadId: "emp-002",
    workMode: "Hybrid",
    status: "Paused",
    capacity: 3,
    memberIds: ["emp-002"],
    tags: ["Policy", "Engagement"],
  },
];


// --------- helpers ----------
export function getEmployeeById(id: string | undefined): EmployeeMini | undefined {
  if (!id) return undefined;
  return mockEmployees.find((e) => e.id === id);
}

export function initials(name: string) {
  const parts = name.split(" ");
  if (parts.length === 1) return parts[0][0] ?? "";
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`;
}

// ------------- Department Modal -------------
export interface DepartmentModalProps {
  open: boolean;
  initial?: Department | null;
  onClose: () => void;
  onSave: (dep: Department) => void;
}


// ------------- Team Modal (with member selection) -------------
export interface TeamModalProps {
  open: boolean;
  department: Department | null;
  initial?: Team | null;
  onClose: () => void;
  onSave: (team: Team) => void;
}


// ------------- Quick View Team Drawer -------------
export interface TeamQuickViewProps {
  team: Team | null;
  onClose: () => void;
}

export type StatusFilter = TeamStatus | "All";