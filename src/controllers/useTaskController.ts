import { useState, useEffect } from 'react';
import { Task, TaskStatus } from '../models/types';
import { TaskModel } from '../models/TaskModel';

export function useTaskController() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    try {
      setIsLoading(true);
      const data = await TaskModel.getAll();
      setTasks(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function addTask(task: Omit<Task, 'id' | 'created_at'>) {
    try {
      const newTask = await TaskModel.add(task);
      setTasks((prev) => [newTask, ...prev]);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }

  async function updateTask(id: string, updates: Partial<Task>) {
    try {
      setTasks((prev) => prev.map(t => t.id === id ? { ...t, ...updates } : t)); // Optimistic
      await TaskModel.update(id, updates);
    } catch (err: any) {
      setError(err.message);
      loadTasks(); // Revert on error
    }
  }

  async function deleteTask(id: string) {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      setTasks((prev) => prev.filter(t => t.id !== id)); // Optimistic
      await TaskModel.delete(id);
    } catch (err: any) {
      setError(err.message);
      loadTasks(); // Revert
    }
  }

  async function moveTask(id: string) {
      const task = tasks.find(t => t.id === id);
      if (!task) return;
      
      if (task.status === 'TODO') {
          if (!confirm('Are you sure you want to move this task?')) return;
          await updateTask(id, { status: 'DONE' });
      } else {
        // Move back to TODO? User didn't specify, but assume toggle
          await updateTask(id, { status: 'TODO' });
      }
  }

  return {
    tasks,
    isLoading,
    error,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
  };
}
