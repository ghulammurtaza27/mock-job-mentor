
import { useQuery } from '@tanstack/react-query';
import Header from "@/components/Header";
import TaskList from "@/components/TaskList";
import TicketList from "@/components/TicketList";
import ProgressDashboard from "@/components/ProgressDashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { geminiTicketGenerator } from '@/services/gemini-ticket-generator';
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const { user } = useAuth();

  const { data: aiTickets, isLoading: isLoadingTickets } = useQuery({
    queryKey: ['ai-tickets'],
    queryFn: () => geminiTicketGenerator.analyzeRepository(),
    enabled: !!user,
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Welcome back!</h1>
            <p className="text-lg text-muted-foreground mt-2">
              Continue your engineering journey with AI-generated tasks and tickets.
            </p>
          </div>
        </div>

        {user && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Your Progress</h2>
            <ProgressDashboard />
          </div>
        )}

        <Tabs defaultValue="tasks" className="space-y-4">
          <TabsList>
            <TabsTrigger value="tasks">Learning Tasks</TabsTrigger>
            <TabsTrigger value="tickets">Work Tickets</TabsTrigger>
          </TabsList>
          <TabsContent value="tasks" className="space-y-4">
            <TaskList />
          </TabsContent>
          <TabsContent value="tickets" className="space-y-4">
            {isLoadingTickets ? (
              <div className="space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : (
              <TicketList aiTickets={aiTickets} />
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
