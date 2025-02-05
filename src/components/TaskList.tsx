import { useState } from "react";
import TaskCard from "./TaskCard";

const MOCK_TASKS = [
  {
    id: 1,
    title: "Optimize Database Queries",
    description: "Analyze and improve the performance of key database queries in the user authentication system.",
    difficulty: "Medium",
    estimatedTime: "2-3 hours",
  },
  {
    id: 2,
    title: "Implement Rate Limiting",
    description: "Add rate limiting to the API endpoints to prevent abuse and ensure system stability.",
    difficulty: "Easy",
    estimatedTime: "1-2 hours",
  },
  {
    id: 3,
    title: "Fix Memory Leak",
    description: "Investigate and resolve a memory leak in the real-time notification system.",
    difficulty: "Hard",
    estimatedTime: "4-5 hours",
  },
] as const;

const TaskList = () => {
  const [selectedTask, setSelectedTask] = useState<number | null>(null);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 animate-fade-in">
      {MOCK_TASKS.map((task) => (
        <TaskCard
          key={task.id}
          title={task.title}
          description={task.description}
          difficulty={task.difficulty}
          estimatedTime={task.estimatedTime}
          onClick={() => setSelectedTask(task.id)}
        />
      ))}
    </div>
  );
};

export default TaskList;