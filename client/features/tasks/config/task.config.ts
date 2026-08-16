import { TaskStatus, TaskPriority } from "../types/task.types";

export interface StatusConfigItem {
  label: string;
  badgeStyle: string;
  dotColor: string;
}

export interface PriorityConfigItem {
  label: string;
  badgeStyle: string;
  iconColor: string;
}

export const TASK_STATUS_CONFIG: Record<TaskStatus, StatusConfigItem> = {
  BACKLOG: {
    label: "Backlog",
    badgeStyle: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    dotColor: "bg-purple-500",
  },
  TODO: {
    label: "To Do",
    badgeStyle: "bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20",
    dotColor: "bg-slate-500",
  },
  DOING: {
    label: "In Progress",
    badgeStyle: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    dotColor: "bg-blue-500",
  },
  COMPLETED: {
    label: "Completed",
    badgeStyle: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    dotColor: "bg-emerald-500",
  },
  ON_HOLD: {
    label: "On Hold",
    badgeStyle: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    dotColor: "bg-amber-500",
  },
};

export const TASK_PRIORITY_CONFIG: Record<TaskPriority, PriorityConfigItem> = {
  URGENT: {
    label: "Urgent",
    badgeStyle: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    iconColor: "text-rose-500",
  },
  HIGH: {
    label: "High",
    badgeStyle: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    iconColor: "text-orange-500",
  },
  MEDIUM: {
    label: "Medium",
    badgeStyle: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    iconColor: "text-amber-500",
  },
  LOW: {
    label: "Low",
    badgeStyle: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
    iconColor: "text-sky-500",
  },
  NONE: {
    label: "No Priority",
    badgeStyle: "bg-muted text-muted-foreground border-border/40",
    iconColor: "text-muted-foreground",
  },
};

export const ALL_STATUSES: TaskStatus[] = ["BACKLOG", "TODO", "DOING", "COMPLETED", "ON_HOLD"];
export const BOARD_STATUSES: TaskStatus[] = ["BACKLOG", "TODO", "DOING", "COMPLETED", "ON_HOLD"];
export const ALL_PRIORITIES: TaskPriority[] = ["URGENT", "HIGH", "MEDIUM", "LOW", "NONE"];
