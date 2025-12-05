// src/pages/employees/EmployeesPage.tsx
import { useEffect, useState } from "react";
import { DataTable } from "../../components/shared/DataTable";
import type { ColumnDef, SortDirection } from "../../types/datatable.types";
import {
  type RowDetailsField,
  RowDetailsModal,
} from "../../components/common/modal/RowDetailsModal";
import { EmployeeListCards } from "./EmployeeListCards";

interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
}

const columns: ColumnDef<Employee>[] = [
  { id: "name", header: "Name", field: "name", sortable: true },
  { id: "email", header: "Email", field: "email" },
  { id: "role", header: "Role", field: "role", sortable: true },
  { id: "department", header: "Department", field: "department" },
];

const detailFields: RowDetailsField<Employee>[] = [
  {
    label: "Name",
    value: (e) => e.name,
  },
  {
    label: "Email",
    value: (e) => e.email,
    fullWidth: true,
  },
  {
    label: "Role",
    value: (e) => e.role,
  },
  {
    label: "Department",
    value: (e) => e.department,
  },
  {
    label: "Employee ID",
    value: (e) => e.id,
    fullWidth: true,
  },
];

export default function EmployeesPage() {
  const [data, setData] = useState<Employee[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortDirection, setSortDirection] =
    useState<SortDirection>("asc");
  const [loading, setLoading] = useState(false);

  const [selectedEmployee, setSelectedEmployee] =
    useState<Employee | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      setTimeout(() => {
        const mock: Employee[] = [
          {
            id: "1",
            name: "Harini Rao",
            email: "harini.rao@example.com",
            role: "Super Admin",
            department: "Management",
          },
          {
            id: "2",
            name: "Aarav Mehta",
            email: "aarav.mehta@example.com",
            role: "HR Manager",
            department: "Human Resources",
          },
          {
            id: "3",
            name: "Sneha Kapoor",
            email: "sneha.kapoor@example.com",
            role: "Software Engineer",
            department: "Engineering",
          },
          {
            id: "4",
            name: "Vikram Singh",
            email: "vikram.singh@example.com",
            role: "Product Manager",
            department: "Product",
          },
          {
            id: "5",
            name: "Nisha Gupta",
            email: "nisha.gupta@example.com",
            role: "UI/UX Designer",
            department: "Design",
          },
          {
            id: "6",
            name: "Rohit Nair",
            email: "rohit.nair@example.com",
            role: "QA Analyst",
            department: "Quality Assurance",
          },
          {
            id: "7",
            name: "Karan Patel",
            email: "karan.patel@example.com",
            role: "Data Scientist",
            department: "Data & AI",
          },
          {
            id: "8",
            name: "Meera Iyer",
            email: "meera.iyer@example.com",
            role: "Content Strategist",
            department: "Marketing",
          },
          {
            id: "9",
            name: "Dev Sharma",
            email: "dev.sharma@example.com",
            role: "Finance Executive",
            department: "Finance",
          },
          {
            id: "10",
            name: "Lakshmi Menon",
            email: "lakshmi.menon@example.com",
            role: "Support Lead",
            department: "Customer Support",
          },
        ];

        // here you can still apply server-side search/paging later
        setData(mock);
        setTotalItems(mock.length);
        setLoading(false);
      }, 400);
    };

    fetchData();
  }, [page, pageSize, search, sortBy, sortDirection]);

  const handleRowClick = (row: Employee) => {
    setSelectedEmployee(row);
    setDetailsOpen(true);
  };

  const handleEdit = (emp: Employee) => {
    console.log("Edit employee:", emp);
  };

  const handleDelete = (emp: Employee) => {
    console.log("Delete employee:", emp);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
        Employees
      </h2>

      {/* MOBILE: card list (no table) */}
      <div className="block md:hidden">
        <EmployeeListCards
          employees={data}
          loading={loading}
          onItemClick={handleRowClick}
        />
      </div>

      {/* DESKTOP/TABLET: full DataTable */}
      <div className="hidden md:block">
        <DataTable<Employee>
          columns={columns}
          data={data}
          totalItems={totalItems}
          page={page}
          pageSize={pageSize}
          pageSizeOptions={[10, 25, 50]}
          sortBy={sortBy || undefined}
          sortDirection={sortDirection}
          onSortChange={(col, dir) => {
            setSortBy(col);
            setSortDirection(dir);
            setPage(1);
          }}
          enableGlobalSearch
          globalSearchValue={search}
          onGlobalSearchChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          isLoading={loading}
          emptyMessage="No employees found."
          onPageChange={setPage}
          onPageSizeChange={(s) => {
            setPageSize(s);
            setPage(1);
          }}
          onRowClick={handleRowClick}
          getRowId={(row) => row.id}
          size="md"
        />
      </div>

      {/* DETAILS MODAL – shared for both table rows & cards */}
      <RowDetailsModal<Employee>
        isOpen={detailsOpen}
        item={selectedEmployee}
        onClose={() => setDetailsOpen(false)}
        title={(e) => `Employee ${e.id}`}
        fields={detailFields}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
