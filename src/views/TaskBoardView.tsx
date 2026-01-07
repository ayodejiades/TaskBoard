"use client";

import React, { useState } from "react";
import { Lane } from "./Lane";
import { useTaskController } from "../controllers/useTaskController";
import { TaskStatus } from "../models/types";

const Icons = {
  Plus: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  Filter: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  ),
  Tag: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    </svg>
  ),
};

export default function TaskBoardView() {
  const { tasks, isLoading, error, addTask, deleteTask, updateTask } =
    useTaskController();
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: "",
    priority: "Medium",
    estimate: 1,
    tags: "",
  });

  const todoTasks = tasks.filter((t) => t.status === "TODO");
  const doneTasks = tasks.filter((t) => t.status === "DONE");

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      title: "",
      description: "",
      deadline: "",
      priority: "Medium",
      estimate: 1,
      tags: "",
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    setEditingId(id);
    setFormData({
      title: task.title,
      description: task.description || "",
      deadline: task.deadline ? task.deadline.split("T")[0] : "",
      priority: task.priority,
      estimate: task.estimate,
      tags: task.tags || "",
    });
    setModalOpen(true);
  };

  const handleDrop = async (taskId: string, newStatus: TaskStatus) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.status === newStatus) return;
    await updateTask(taskId, { status: newStatus });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    if (editingId) {
      await updateTask(editingId, {
        ...formData,
        priority: formData.priority as any,
        estimate: Number(formData.estimate),
      });
    } else {
      await addTask({
        ...formData,
        priority: formData.priority as any,
        estimate: Number(formData.estimate),
        status: "TODO",
      });
    }
    setModalOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<any>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (isLoading)
    return (
      <div
        className="loading"
        style={{
          color: "white",
          display: "grid",
          placeItems: "center",
          height: "100vh",
        }}
      >
        Loading...
      </div>
    );
  if (error)
    return <div style={{ color: "red", padding: 20 }}>Error: {error}</div>;

  return (
    <main>
      <nav></nav>
      <header className="header">
        <h1>TaskBoard</h1>
        <div className="header-actions">
          <button
            className="action action-primary"
            title="Add Task"
            onClick={handleOpenAdd}
          >
            <Icons.Plus />
          </button>
          <button className="action" title="Filter">
            <Icons.Filter />
          </button>
          <button className="action" title="Tags">
            <Icons.Tag />
          </button>
        </div>
      </header>

      <div className="lanes">
        <Lane
          title="To Do"
          status="TODO"
          tasks={todoTasks}
          onEdit={handleOpenEdit}
          onDelete={deleteTask}
          onDrop={handleDrop}
        />
        <Lane
          title="Done"
          status="DONE"
          tasks={doneTasks}
          onEdit={handleOpenEdit}
          onDelete={deleteTask}
          onDrop={handleDrop}
        />
      </div>

      <div
        className={`modal ${isModalOpen ? "open" : ""}`}
        onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}
      >
        <div className="form-container">
          <span className="close" onClick={() => setModalOpen(false)}>
            &times;
          </span>
          <h2>{editingId ? "Edit Task" : "New Task"}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title</label>
              <input
                className="form-input"
                name="title"
                value={formData.title}
                onChange={handleChange}
                autoFocus
                required
                placeholder="E.g., Design System"
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                className="form-input"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Details..."
              />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Priority</label>
                <select
                  className="form-input"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Estimate (h)</label>
                <input
                  type="number"
                  className="form-input"
                  name="estimate"
                  value={formData.estimate}
                  onChange={handleChange}
                  min="0"
                />
              </div>
            </div>
            <div className="form-group">
              <label>Deadline</label>
              <input
                type="date"
                className="form-input"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Tags</label>
              <input
                className="form-input"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="design, dev, urgent"
              />
            </div>
            <button type="submit" className="btn-submit">
              {editingId ? "Save Changes" : "Create Task"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
