export interface Project {
  id: string;
  name: string;
  description: string | null;
  workspaceId: string;
  taskCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectInput {
  name: string;
  description?: string | null;
}

export interface UpdateProjectInput {
  name?: string;
  description?: string | null;
}

export interface ProjectsResponse {
  data: {
    projects: Project[];
  };
}

export interface ProjectResponse {
  data: {
    project: Project;
  };
}
