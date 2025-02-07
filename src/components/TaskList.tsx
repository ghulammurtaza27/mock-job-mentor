import { useState, useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import TaskCard from "./TaskCard";
import { Tables } from "@/integrations/supabase/types";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

type Task = Tables<"tickets">;

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
  const navigate = useNavigate();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
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
      return data;
    },
    enabled: !!user,
  });

  // Handle error with useEffect
  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load tickets. Please try again later.",
      });
    }
  }, [error, toast]);

  // Subscribe to real-time changes
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tickets'
        },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ["tickets", user.id] });
          
          const event = payload.eventType;
          const message = event === 'INSERT' 
            ? 'New ticket added!'
            : event === 'UPDATE'
            ? 'Ticket updated'
            : 'Ticket removed';
            
          toast({
            title: "Ticket Update",
            description: message,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, toast, user]);

  // Add start task mutation
  const startTaskMutation = useMutation({
    mutationFn: async (ticketId: string) => {
      const { data, error } = await supabase
        .from('tickets')
        .update({ 
          status: 'in_progress',
          started_at: new Date().toISOString() 
        })
        .eq('id', ticketId)
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      return data;
    },
    onError: (error) => {
      console.error('Mutation error:', error);
      toast({
        title: 'Error',
        description: 'Failed to start task',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      toast({
        title: 'Success',
        description: 'Task started successfully',
      });
    },
  });

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    if (task.status === 'open') {
      setShowStartDialog(true);
    } else {
      navigate(`/workspace/${task.id}`);
    }
  };

  const handleStartTask = async () => {
    if (!selectedTask) return;
    
    try {
      await startTaskMutation.mutateAsync(selectedTask.id);
      setShowStartDialog(false);
      navigate(`/workspace/${selectedTask.id}`);
    } catch (error) {
      console.error('Handle start task error:', error); // Debug log
      toast('Failed to start task', {
        description: 'Please try again',
      });
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    const colors = {
      Easy: "bg-green-500/10 text-green-500",
      Medium: "bg-yellow-500/10 text-yellow-500",
      Hard: "bg-red-500/10 text-red-500"
    };
    return <Badge className={colors[difficulty]}>{difficulty}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      open: "bg-slate-500/10 text-slate-500",
      in_progress: "bg-blue-500/10 text-blue-500",
      in_review: "bg-purple-500/10 text-purple-500",
      completed: "bg-green-500/10 text-green-500"
    };
    const labels = {
      open: "Open",
      in_progress: "In Progress",
      in_review: "In Review",
      completed: "Completed"
    };
    return <Badge className={colors[status]}>{labels[status]}</Badge>;
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
          <div
            key={task.id}
            className="group relative bg-card rounded-lg border p-6 hover:shadow-md transition-shadow"
            role="button"
            tabIndex={0}
            onClick={() => handleTaskClick(task)}
            onKeyDown={(e) => e.key === 'Enter' && handleTaskClick(task)}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-1">
                <h3 className="font-semibold text-lg">{task.title}</h3>
                <div className="flex gap-2">
                  {getDifficultyBadge(task.difficulty)}
                  {getStatusBadge(task.status)}
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                {task.estimated_time} mins
              </div>
            </div>
            <p className="text-muted-foreground mb-4">{task.description}</p>
            <div className="absolute inset-0 rounded-lg ring-offset-background transition-colors hover:bg-accent/5 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2" />
          </div>
        ))}
      </div>

      <Dialog open={showStartDialog} onOpenChange={setShowStartDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start Task: {selectedTask?.title}</DialogTitle>
            <DialogDescription>
              This task will take approximately {selectedTask?.estimated_time} minutes. 
              Are you ready to begin?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Once you start, you'll be taken to the workspace where you can:
              <ul className="list-disc list-inside mt-2">
                <li>Write and test your code</li>
                <li>Submit your solution for review</li>
                <li>Get real-time feedback</li>
              </ul>
            </p>
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowStartDialog(false)}
              >
                Not Now
              </Button>
              <Button
                onClick={handleStartTask}
                disabled={startTaskMutation.isPending}
              >
                {startTaskMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Starting...
                  </>
                ) : (
                  "Start Task"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TaskList;