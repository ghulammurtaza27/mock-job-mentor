
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import type { Ticket } from "@/types/supabase";

interface StartTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticket: Ticket | null;
  onStart: () => void;
}

export function StartTaskDialog({ open, onOpenChange, ticket, onStart }: StartTaskDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      toast({
        title: 'Success',
        description: 'Task started successfully',
      });
      onStart();
    },
    onError: (error) => {
      console.error('Mutation error:', error);
      toast({
        title: 'Error',
        description: 'Failed to start task',
        variant: 'destructive',
      });
    },
  });

  const handleStartTask = async () => {
    if (!ticket) return;
    await startTaskMutation.mutateAsync(ticket.id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start Task: {ticket?.title}</DialogTitle>
          <DialogDescription>
            This task will take approximately {ticket?.estimated_time} minutes. 
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
              onClick={() => onOpenChange(false)}
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
  );
}

