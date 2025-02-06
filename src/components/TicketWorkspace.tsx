import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TicketWorkspaceProps {
  ticketId: string;
  onClose: () => void;
}

const TicketWorkspace = ({ ticketId, onClose }: TicketWorkspaceProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [solution, setSolution] = useState("");

  const { data: ticket } = useQuery({
    queryKey: ["ticket", ticketId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tickets")
        .select("*")
        .eq("id", ticketId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const submitSolution = useMutation({
    mutationFn: async () => {
      const { error: updateError } = await supabase
        .from("tickets")
        .update({ status: "review" })
        .eq("id", ticketId);

      if (updateError) throw updateError;

      const { error: reviewError } = await supabase
        .from("reviews")
        .insert({
          ticket_id: ticketId,
          content: solution,
          status: "pending",
        });

      if (reviewError) throw reviewError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      toast({
        title: "Solution submitted",
        description: "Your solution has been submitted for review.",
      });
      onClose();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit solution. Please try again.",
      });
    },
  });

  if (!ticket) return null;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{ticket.title}</CardTitle>
            <CardDescription>{ticket.description}</CardDescription>
          </div>
          <Badge>{ticket.difficulty}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Your Solution</label>
            <Textarea
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              placeholder="Write your solution here..."
              className="mt-1.5"
              rows={10}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button 
          onClick={() => submitSolution.mutate()}
          disabled={!solution.trim() || submitSolution.isPending}
        >
          Submit Solution
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TicketWorkspace;