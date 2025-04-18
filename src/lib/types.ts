export type TaskStatus = 'pending' | 'approved' | 'rejected';
export type TaskAction = 'approve' | 'reject';

export interface Task {
  id: string;
  task: string;
  email: string;
  status: TaskStatus;
  created_at: string;
  updated_at?: string;
}

export interface CreateTaskInput {
  task: string;
  email: string;
  status: TaskStatus;
}

export interface UpdateTaskInput {
  task?: string;
  email?: string;
} 

