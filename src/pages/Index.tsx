
import { useQuery } from '@tanstack/react-query';
import Header from "@/components/Header";
import TaskList from "@/components/TaskList";
import TicketList from "@/components/TicketList";
import ProgressDashboard from "@/components/ProgressDashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { geminiTicketGenerator } from '@/services/gemini-ticket-generator';
import { LoadingSpinner } from "@/components/LoadingSpinner";
import ErrorBoundaryWrapper from '@/components/ErrorBoundaryWrapper';
import { Alert, AlertDescription } from "@/components/ui/alert";

const Index = () => {
  const { user } = useAuth();

  const { data: aiTickets, isLoading: isLoadingTickets, error: ticketsError } = useQuery({
    queryKey: ['ai-tickets'],
    queryFn: () => geminiTicketGenerator.analyzeRepository(),
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 2,
  });

  return (
    <div className="min-h-screen bg-background">
      <ErrorBoundaryWrapper name="Header">
        <Header />
      </ErrorBoundaryWrapper>

      <main className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              Welcome back!
            </h1>
            <p className="text-lg text-muted-foreground mt-2">
              Continue your engineering journey with AI-generated tasks and tickets.
            </p>
          </div>
        </div>

        {user && (
          <ErrorBoundaryWrapper name="ProgressDashboard">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Your Progress</h2>
              <ProgressDashboard />
            </div>
          </ErrorBoundaryWrapper>
        )}

        <Tabs defaultValue="tasks" className="space-y-4">
          <TabsList>
            <TabsTrigger value="tasks">Learning Tasks</TabsTrigger>
            <TabsTrigger value="tickets">Work Tickets</TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="space-y-4">
            <ErrorBoundaryWrapper name="TaskList">
              <TaskList />
            </ErrorBoundaryWrapper>
          </TabsContent>

          <TabsContent value="tickets" className="space-y-4">
            <ErrorBoundaryWrapper name="TicketList">
              {isLoadingTickets ? (
                <div className="flex justify-center p-8">
                  <LoadingSpinner size={32} />
                </div>
              ) : ticketsError ? (
                <Alert variant="destructive">
                  <AlertDescription>
                    Failed to load tickets. Please try again later.
                  </AlertDescription>
                </Alert>
              ) : (
                <TicketList aiTickets={aiTickets} />
              )}
            </ErrorBoundaryWrapper>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
