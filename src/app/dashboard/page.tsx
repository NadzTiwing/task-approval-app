import DashboardClient from './DashboardClient';
import { getTasks } from './action';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DashboardPage() {
  const tasks = await getTasks();
  return <DashboardClient initialTasks={Array.isArray(tasks) ? tasks : []} />;
}