import { apiClient } from "@/lib/api-client";
import { WorkspaceMemberUser } from "@/features/tasks/types/task.types";

export interface WorkspaceMembersResponse {
  data: {
    members: WorkspaceMemberUser[];
  };
}

export const workspaceApi = {
  getMembers: (token?: string) =>
    apiClient<WorkspaceMembersResponse>("/workspaces/me/members", {
      method: "GET",
      token,
    }),
};
