export type TaskStatus =
  | "BACKLOG"
  | "TODO"
  | "DOING"
  | "COMPLETED"
  | "ON_HOLD";

export type TaskPriority =
  | "NONE"
  | "URGENT"
  | "HIGH"
  | "MEDIUM"
  | "LOW";

export interface WorkspaceMemberUser {
  id: string;
  fullName: string;
  email: string | null;
  avatarUrl: string | null;
}

export interface Label {
  id: string;
  name: string;
  color: string | null;
}

export interface TaskProject {
  id: string;
  name: string;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  startDate: string | null;
  dueDate: string | null;
  parentTaskId: string | null;
  members: WorkspaceMemberUser[];
  labels: Label[];
  reporter: WorkspaceMemberUser | null;
  project: TaskProject | null;
  createdAt: string;
  updatedAt: string;
}

export interface FieldVisibility {
  priority: boolean;
  members: boolean;
  dates: boolean;
  labels: boolean;
}

export interface TaskFilters {
  statuses: TaskStatus[];
  priorities: TaskPriority[];
  memberIds: string[];
  labelIds: string[];
}

export interface CreateTaskInput {
  title: string;
  description?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  projectId?: string | null;
  reporterId?: string | null;
  parentTaskId?: string | null;
  startDate?: string | null;
  dueDate?: string | null;
  memberIds?: string[];
  labelIds?: string[];
}

export type UpdateTaskInput = Partial<CreateTaskInput>;
