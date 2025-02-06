import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

const ProgressDashboard = () => {
  const { user } = useAuth();

  const { data: progress } = useQuery({
    queryKey: ["career-progress", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("career_progress")
        .select("*")
        .eq("user_id", user?.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: completedTickets } = useQuery({
    queryKey: ["completed-tickets", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tickets")
        .select("*")
        .eq("assigned_to", user?.id)
        .eq("status", "completed");

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Current Level</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold capitalize">{progress?.current_level || "Junior"}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Experience Points</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{progress?.experience_points || 0} XP</p>
          <Progress value={((progress?.experience_points || 0) % 100)} className="mt-2" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Completed Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{completedTickets?.length || 0}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressDashboard;