// src/pages/clients/tabs/ProjectsTab.tsx
import React, { useMemo } from "react";
import type { Client } from "../../../types/client.types";
import { ProjectManagementTable } from "../../projects/ProjectList";
import type { Project } from "../../../types/project.types";
import { mockProjects } from "../../projects/Projects";

interface Props {
  client: Client;
}

const ProjectsTab: React.FC<Props> = ({ client }) => {
  const filteredProjects = useMemo<Project[]>(
    () => mockProjects.filter((p) => p.client === client.name),
    [client]
  );

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-4 text-xs text-slate-200">
      {/* {filteredProjects.length === 0 ? (
        <p className="text-slate-400 text-center py-6">
          No projects linked to {client.name}.
        </p>
      ) : ( */}
        <ProjectManagementTable
          projects={filteredProjects}
          onEdit={() => {}}
          onDelete={() => {}}
          onReassign={() => {}}
          onToggleFavorite={() => {}}
          onOpenDetails={() => {}}
        />
      {/* )} */}
    </div>
  );
};

export default ProjectsTab;
