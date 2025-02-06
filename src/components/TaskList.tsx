import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import TaskCard from "./TaskCard";
import { Tables } from "@/integrations/supabase/types";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

type Task = Tables<"tasks">;

const fetchTasks = async () => {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

const TaskList = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  
  const { data: tasks, isLoading, error } = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
  });

  // Subscribe to real-time changes
  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all changes (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'tasks'
        },
        (payload) => {
          // Invalidate and refetch tasks when changes occur
          queryClient.invalidateQueries({ queryKey: ["tasks"] });
          
          // Show toast notification for changes
          const event = payload.eventType;
          const message = event === 'INSERT' 
            ? 'New task added!'
            : event === 'UPDATE'
            ? 'Task updated'
            : 'Task removed';
            
          toast({
            title: "Task Update",
            description: message,
          });
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, toast]);

  if (error) {
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to load tasks. Please try again later.",
    });
  }

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-4 p-6 border rounded-lg">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <div className="flex justify-between items-center pt-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 animate-fade-in">
      {tasks?.map((task) => (
        <TaskCard
          key={task.id}
          title={task.title}
          description={task.description}
          difficulty={task.difficulty as "Easy" | "Medium" | "Hard"}
          estimatedTime={task.estimated_time}
          onClick={() => setSelectedTask(task.id)}
        />
      ))}
    </div>
  );
};

export default TaskList;