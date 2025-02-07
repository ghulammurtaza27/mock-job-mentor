
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { TicketCard } from "./ticket/TicketCard";
import { StartTaskDialog } from "./ticket/StartTaskDialog";
import type { Ticket } from "@/types/supabase";

export function TaskList() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedTask, setSelectedTask] = useState<Ticket | null>(null);
  const [showStartDialog, setShowStartDialog] = useState(false);
  const { user } = useAuth();
  
  const { data: tasks, isLoading, error } = useQuery({
    queryKey: ["tickets", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tickets")
        .select("*")
        .eq("assigned_to", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Ticket[];
    },
    enabled: !!user,
  });

  if (error) {
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to load tickets. Please try again later.",
    });
  }

  const handleTaskClick = (task: Ticket) => {
    setSelectedTask(task);
    if (task.status === 'open') {
      setShowStartDialog(true);
    } else {
      navigate(`/workspace/${task.id}`);
    }
  };

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
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tasks?.map((task) => (
          <TicketCard
            key={task.id}
            ticket={task}
            onClick={handleTaskClick}
          />
        ))}
      </div>

      <StartTaskDialog
        open={showStartDialog}
        onOpenChange={setShowStartDialog}
        ticket={selectedTask}
        onStart={() => {
          if (selectedTask) {
            navigate(`/workspace/${selectedTask.id}`);
          }
        }}
      />
    </>
  );
}

export default TaskList;

