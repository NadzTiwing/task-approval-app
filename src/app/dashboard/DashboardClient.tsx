'use client';

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Task } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { logout } from "./action";
import { useRouter } from "next/navigation";
import { sendEmail, updateTask, deleteTask, createTask } from "./action";

interface DashboardClientProps {
  initialTasks: Task[];
}

export default function DashboardClient({ initialTasks }: DashboardClientProps) {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [newTask, setNewTask] = useState({ task: '', email: '' });
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Partial<Task>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    const data = await createTask(newTask.task, newTask.email);
    if (data?.error) {
      toast.error(data.error);
      setIsSending(false);
    } else {
      const emailResponse = await sendEmail({ to: newTask.email, token: data.token, task: newTask.task });
      if (emailResponse?.error) {
        toast.error(emailResponse.error);
      } else {
        toast.success('Email sent successfully');
      }
      setTasks([data, ...tasks]);
      setNewTask({ task: '', email: '' });
      setIsDialogOpen(false);
      toast.success('Task created successfully');
      setIsSending(false);
    }
  };

  const confirmDeleteTask = (id: string) => {
    setTaskToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteTask = async (id: string) => {
    const data = await deleteTask(id);
    if (data?.error) {
      toast.error(data.error);
    } else {
      toast.success('Task deleted successfully');
      setTasks(tasks.filter(task => task.id !== id));
      setIsDeleteDialogOpen(false);
      setTaskToDelete(null);
    }
  };

  const handleEditTask = (currentTask: Task) => {
    setEditingTaskId(currentTask.id);
    setEditingTask({ task: currentTask.task, email: currentTask.email });
  };

  const handleUpdateTask = async (id: string) => {
    setIsSaving(true);

    const data = await updateTask(id, editingTask.task || '');
    if (data?.error) {
      toast.error(data.error);
      setEditingTaskId(null);
      setIsSaving(false);
    } else {
      toast.success('Task updated successfully');
      setTasks(tasks.map(task => task.id === id ? data : task));
      setEditingTaskId(null);
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    const response = await logout();
    if (response?.error) {
      toast.error(response.error);
    }

    router.push('/login');
  };

  return (
    <div className="container mx-auto py-10">
      <Toaster />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Task Management</h1>
        <div className="space-x-4">
          <Button onClick={() => setIsDialogOpen(true)}>Create Task</Button>
          <Button variant="outline" onClick={() => handleLogout()}>Logout</Button>
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader className="bg-slate-200">
            <TableRow>
              <TableHead>Task Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={`row-${task.id}`}>
                <TableCell>
                  {editingTaskId === task.id ? (
                    <Textarea
                      value={editingTask.task}
                      onChange={(e) => setEditingTask({ ...editingTask, task: e.target.value })}
                      disabled={isSaving}
                      className="min-h-[80px]"
                    />
                  ) : (
                    task.task
                  )}
                </TableCell>
                <TableCell>
                  {task.email}
                </TableCell>
                <TableCell>
                  <Badge 
                  className={`font-bold ${task.status === 'pending' ? 'bg-amber-200' : task.status === 'rejected' ? 'bg-rose-300' : 'bg-emerald-400'}`}
                  variant="outline">
                    {task.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="space-x-2">
                    {editingTaskId === task.id ? (
                      <Button variant="outline" size="sm" onClick={() => handleUpdateTask(task.id)} disabled={isSaving}>
                        {isSaving ? 'Saving...' : 'Save'}
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" onClick={() => handleEditTask(task)} disabled={isSaving}>
                        Edit
                      </Button>
                    )}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => confirmDeleteTask(task.id)}
                      disabled={isSaving || editingTaskId === task.id}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} aria-labelledby="create-task-dialog-title" aria-describedby="create-task-dialog-description">
        <DialogContent aria-describedby="create-task-dialog-description" aria-labelledby="create-task-dialog-title">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateTask} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Task</label>
              <Textarea
                value={newTask.task}
                onChange={(e) => setNewTask({ ...newTask, task: e.target.value })}
                required
                className="min-h-[80px]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input
                type="email"
                value={newTask.email}
                onChange={(e) => setNewTask({ ...newTask, email: e.target.value })}
                required
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSending}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSending}>{isSending ? 'Sending...' : 'Send Task'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen} aria-labelledby="delete-task-dialog-title" aria-describedby="delete-task-dialog-description">
        <DialogContent aria-describedby="delete-task-dialog-description" aria-labelledby="delete-task-dialog-title">
          <DialogHeader>
            <DialogTitle>Are you sure you want to delete this task?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the task.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => taskToDelete && handleDeleteTask(taskToDelete)}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}