export type TaskStatus = 'TODO' | 'DONE';
export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface Task {
  id: string; // UUID from Supabase
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  deadline: string; // ISO string
  estimate: number; // hours
  tags: string; // Comma separated for simplicity, or JSON
  created_at?: string;
}
