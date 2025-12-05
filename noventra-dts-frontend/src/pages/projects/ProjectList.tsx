import React from "react";
import type { ColumnDef, SortDirection } from "../../types/datatable.types";
import type { Project } from "../../types/project.types";
import {
  Edit2,
  Trash2,
  UserSquare,
  Star,
  StarOff,
} from "lucide-react";
import { DataTable } from "../../components/shared/DataTable";

interface ProjectManagementTableProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
  onReassign: (project: Project) => void;
  onToggleFavorite: (projectId: string) => void;
  onOpenDetails: (project: Project) => void;
}

export const ProjectManagementTable: React.FC<ProjectManagementTableProps> = ({
  projects,
  onEdit,
  onDelete,
  onReassign,
  onToggleFavorite,
  onOpenDetails,
}) => {
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [search, setSearch] = React.useState("");
  const [sortBy, setSortBy] = React.useState<string | undefined>("name");
  const [sortDirection, setSortDirection] =
    React.useState<SortDirection>("asc");

  const columns: ColumnDef<Project>[] = [
    {
      id: "favorite",
      header: "",
      align: "center",
      cell: (row) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(row.id);
          }}
          className="inline-flex h-7 w-7 items-center justify-center rounded-full text-yellow-300 hover:bg-slate-900"
          title={row.isFavorite ? "Unpin project" : "Pin project"}
        >
          {row.isFavorite ? (
            <Star size={14} className="fill-yellow-300" />
          ) : (
            <StarOff size={14} />
          )}
        </button>
      ),
    },
    { id: "name", header: "Project", field: "name", sortable: true },
    { id: "code", header: "Code", field: "code", sortable: true },
    { id: "owner", header: "Owner", field: "owner", sortable: true },
    {
      id: "assignee",
      header: "Assigned To",
      field: "assignee",
      sortable: true,
    },
    { id: "status", header: "Status", field: "status", sortable: true },
    {
      id: "priority",
      header: "Priority",
      field: "priority",
      sortable: true,
      hideOnMobile: true,
    },
    {
      id: "dueDate",
      header: "Due Date",
      field: "dueDate",
      sortable: true,
      hideOnMobile: true,
    },
    {
      id: "actions",
      header: "Actions",
      align: "right",
      cell: (row) => (
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onReassign(row);
            }}
            className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-slate-300 hover:bg-slate-800"
            title="Reassign"
          >
            <UserSquare size={14} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(row);
            }}
            className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-slate-300 hover:bg-slate-800"
            title="Edit"
          >
            <Edit2 size={14} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(row);
            }}
            className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-red-900/80 text-red-200 hover:bg-red-800"
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  // client-side filtering / sorting
  const filtered = React.useMemo(() => {
    let rows = [...projects];
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.code.toLowerCase().includes(q) ||
          p.owner.toLowerCase().includes(q) ||
          p.assignee.toLowerCase().includes(q),
      );
    }
    if (sortBy) {
      rows.sort((a, b) => {
        const av = (a as any)[sortBy];
        const bv = (b as any)[sortBy];
        if (av == null) return 1;
        if (bv == null) return -1;
        const comp = String(av).localeCompare(String(bv));
        return sortDirection === "asc" ? comp : -comp;
      });
    }

    // favorites on top
    rows.sort((a, b) => {
      const fa = a.isFavorite ? 1 : 0;
      const fb = b.isFavorite ? 1 : 0;
      return fb - fa; // favorite first
    });

    return rows;
  }, [projects, search, sortBy, sortDirection]);

  const totalItems = filtered.length;
  const startIndex = (page - 1) * pageSize;
  const pageData = filtered.slice(startIndex, startIndex + pageSize);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-100">
          Project Management
        </h2>
        <span className="text-[11px] text-slate-500">
          Click a row to open quick view
        </span>
      </div>

      <DataTable<Project>
        columns={columns}
        data={pageData}
        totalItems={totalItems}
        page={page}
        pageSize={pageSize}
        sortBy={sortBy}
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
        isLoading={false}
        emptyMessage="No projects found."
        onPageChange={setPage}
        onPageSizeChange={(s) => {
          setPageSize(s);
          setPage(1);
        }}
        getRowId={(row) => row.id}
        size="md"
        onRowClick={(row) => onOpenDetails(row)}
      />
    </div>
  );
};
