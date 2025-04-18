import DashboardClient from './DashboardClient';
import { getTasks } from './action';

export default async function DashboardPage() {
  const tasks = await getTasks();
  return <DashboardClient initialTasks={Array.isArray(tasks) ? tasks : []} />;
}