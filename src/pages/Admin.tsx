import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { Database } from "@/types/supabase";

// Add proper types
type User = Database['public']['Tables']['profiles']['Row'];
type Ticket = Database['public']['Tables']['tickets']['Row'];

const Admin = () => {
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // Add error handling and loading state to users query
  const { data: users, isLoading: isLoadingUsers, error: usersError } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq('role', 'developer'); // Only fetch developers

      if (error) throw error;
      return data;
    },
  });

  // Use mutation for ticket generation
  const generateTicketMutation = useMutation({
    mutationFn: async ({ category, assignedTo }: { category: string; assignedTo: string }) => {
      const response = await supabase.functions.invoke('generate-tickets', {
        body: { category, assignedTo },
      });

      if (response.error) throw response.error;
      return response.data;
    },
    onSuccess: () => {
      toast.success("Ticket generated and assigned successfully");
      // Reset form
      setSelectedUser("");
      setSelectedCategory("");
      // Invalidate tickets query to refresh list
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
    onError: (error) => {
      toast.error("Failed to generate ticket: " + error.message);
    }
  });

  const handleGenerateTicket = () => {
    if (!selectedUser || !selectedCategory) {
      toast.error("Please select both a user and ticket category");
      return;
    }

    generateTicketMutation.mutate({
      category: selectedCategory,
      assignedTo: selectedUser
    });
  };

  // Add error state
  if (usersError) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-destructive">Error loading users: {(usersError as Error).message}</div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <Card>
          <CardHeader>
            <CardTitle>Generate AI Tickets</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Assign To</label>
              <Select 
                value={selectedUser} 
                onValueChange={setSelectedUser}
                disabled={isLoadingUsers}
              >
                <SelectTrigger>
                  <SelectValue placeholder={isLoadingUsers ? "Loading..." : "Select user"} />
                </SelectTrigger>
                <SelectContent>
                  {users?.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.full_name || user.username || user.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Ticket Category</label>
              <Select 
                value={selectedCategory} 
                onValueChange={setSelectedCategory}
                disabled={generateTicketMutation.isPending}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="feature">Feature Development</SelectItem>
                  <SelectItem value="bug">Bug Fix</SelectItem>
                  <SelectItem value="optimization">Optimization</SelectItem>
                  <SelectItem value="infrastructure">Infrastructure</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              className="w-full" 
              onClick={handleGenerateTicket}
              disabled={generateTicketMutation.isPending || !selectedUser || !selectedCategory}
            >
              {generateTicketMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Ticket"
              )}
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Admin;