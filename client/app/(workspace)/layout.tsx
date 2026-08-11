import { ReactNode } from "react";
import { WorkspaceAuthGate } from "@/components/workspace/WorkspaceAuthGate";
import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";

export const metadata = {
  title: "Workspace | Taskora",
  description: "Manage your tasks and projects in Taskora Workspace",
};

export default function WorkspaceLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <WorkspaceAuthGate>
      <WorkspaceShell>{children}</WorkspaceShell>
    </WorkspaceAuthGate>
  );
}
