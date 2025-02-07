
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Ticket } from "@/types/supabase";

interface TicketCardProps {
  ticket: Ticket;
  onClick: (ticket: Ticket) => void;
}

export function TicketCard({ ticket, onClick }: TicketCardProps) {
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

  return (
    <div
      className="group relative bg-card rounded-lg border p-6 hover:shadow-md transition-shadow"
      role="button"
      tabIndex={0}
      onClick={() => onClick(ticket)}
      onKeyDown={(e) => e.key === 'Enter' && onClick(ticket)}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-1">
          <h3 className="font-semibold text-lg">{ticket.title}</h3>
          <div className="flex gap-2">
            {getDifficultyBadge(ticket.difficulty)}
            {getStatusBadge(ticket.status)}
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          {ticket.estimated_time} mins
        </div>
      </div>
      <p className="text-muted-foreground mb-4">{ticket.description}</p>
      <div className="absolute inset-0 rounded-lg ring-offset-background transition-colors hover:bg-accent/5 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2" />
    </div>
  );
}

