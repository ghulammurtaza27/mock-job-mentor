import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import TicketWorkspace from "./TicketWorkspace";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

type Ticket = Tables<"tickets">;

const fetchTickets = async () => {
  const { data, error } = await supabase
    .from("tickets")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

const TicketList = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  
  const { data: tickets, isLoading, error } = useQuery({
    queryKey: ["tickets"],
    queryFn: fetchTickets,
  });

  useEffect(() => {
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
          queryClient.invalidateQueries({ queryKey: ["tickets"] });
          
          const event = payload.eventType;
          const message = event === 'INSERT' 
            ? 'New ticket created!'
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
  }, [queryClient, toast]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'hard':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'bg-blue-500';
      case 'in_progress':
        return 'bg-yellow-500';
      case 'review':
        return 'bg-purple-500';
      case 'completed':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (error) {
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to load tickets. Please try again later.",
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
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 animate-fade-in">
        {tickets?.map((ticket) => (
          <Card key={ticket.id} className="flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{ticket.title}</CardTitle>
                <Badge className={getStatusColor(ticket.status || 'open')}>
                  {ticket.status || 'Open'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground">{ticket.description}</p>
              <div className="flex gap-2 mt-4">
                <Badge variant="outline">{ticket.type}</Badge>
                <Badge className={getDifficultyColor(ticket.difficulty)}>
                  {ticket.difficulty}
                </Badge>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <p className="text-sm text-muted-foreground">
                {new Date(ticket.created_at || '').toLocaleDateString()}
              </p>
              {user && ticket.assigned_to === user.id && (
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedTicket(ticket.id)}
                >
                  Work on Ticket
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
        <DialogContent className="max-w-4xl">
          {selectedTicket && (
            <TicketWorkspace
              ticketId={selectedTicket}
              onClose={() => setSelectedTicket(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TicketList;