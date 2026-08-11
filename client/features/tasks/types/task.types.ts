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

export interface TaskMember {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface TaskLabel {
  id: string;
  name: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  members: TaskMember[];
  startDate?: string;
  dueDate?: string;
  labels: TaskLabel[];
  reporter?: {
    id: string;
    name: string;
  };
  project?: {
    id: string;
    name: string;
  };
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
