"use client";

import React, { useState } from "react";
import { Task, TaskStatus } from "../models/types";
import { TaskCard } from "./TaskCard";

const SortIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="4" y1="6" x2="20" y2="6" />
    <line x1="4" y1="12" x2="16" y2="12" />
    <line x1="4" y1="18" x2="12" y2="18" />
  </svg>
);

interface LaneProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onDrop: (taskId: string, newStatus: TaskStatus) => void;
}

export function Lane({
  title,
  status,
  tasks,
  onEdit,
  onDelete,
  onDrop,
}: LaneProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const taskId = e.dataTransfer.getData("text/plain");
    if (taskId) {
      onDrop(taskId, status);
    }
  };

  return (
    <article
      className={`lane ${isDragOver ? "lane--drag-over" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <header className="lane__header">
        <em>{tasks.length}</em>
        <h2>{title}</h2>
        <button className="action" title="Sort tasks" type="button">
          <SortIcon />
        </button>
      </header>
      <div className="lane__tasks">
        {tasks.length === 0 ? (
          <div className="lane__empty">Drop tasks here</div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </article>
  );
}
