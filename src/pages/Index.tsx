import Header from "@/components/Header";
import TaskList from "@/components/TaskList";
import TicketList from "@/components/TicketList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Welcome back!</h1>
            <p className="text-lg text-muted-foreground mt-2">
              Continue your engineering journey with these tasks and tickets.
            </p>
          </div>
        </div>
        <Tabs defaultValue="tasks" className="space-y-4">
          <TabsList>
            <TabsTrigger value="tasks">Learning Tasks</TabsTrigger>
            <TabsTrigger value="tickets">Work Tickets</TabsTrigger>
          </TabsList>
          <TabsContent value="tasks" className="space-y-4">
            <TaskList />
          </TabsContent>
          <TabsContent value="tickets" className="space-y-4">
            <TicketList />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;