import TaskoraLogin from "@/components/auth/TaskoraLogin";

export const metadata = {
  title: "Login | Taskora",
  description: "Sign in to your Taskora workspace",
};

export default function LoginPage() {
  return <TaskoraLogin />;
}
