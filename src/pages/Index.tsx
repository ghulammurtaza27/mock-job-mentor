import Header from "@/components/Header";
import TaskList from "@/components/TaskList";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Welcome back!</h1>
            <p className="text-lg text-muted-foreground mt-2">
              Continue your engineering journey with these tasks.
            </p>
          </div>
        </div>
        <TaskList />
      </main>
    </div>
  );
};

export default Index;